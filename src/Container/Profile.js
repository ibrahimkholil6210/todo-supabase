import { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../Context/User.Context";
import Layout from "../Layout";
import { supabase } from "../Utills/SupabaseClient";

const Profile = (props) => {
  const { user, session, signOut } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [uploading, setUploading] = useState(false);
  const [avatar_url, setAvatar_url] = useState("");

  const setDataToState = async (data) => {
    setUsername(data.username);
    setWebsite(data.website);
    if (!data.avatar_url) return;
    const { data: avatar_path, error } = await supabase.storage.from("avatars").download(data.avatar_url);
    if (error) {
      throw error;
    }
    const url = URL.createObjectURL(avatar_path);
    setAvatar_url(url);
  };

  const getProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      let { data, error, status } = await supabase.from("profiles").select(`*`).eq("id", user.id).single();
      console.log({ data, error, status });
      if (data) return setDataToState(data);
      if (error) throw error;
    } catch (err) {
      console.log(err);
      // alert("Something went wrong!");
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
      };
      let { data, error, status } = await supabase.from("profiles").insert(updates);
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const updates = {
        username,
        website,
      };
      let { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;
      console.log("Profile Update");
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { data, error: uploadError, status } = await supabase.storage.from("avatars").upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // onUpload(filePath);
      console.log({ data, uploadError, status, filePath });
      if (data) {
        let { error: avatarUpdateError } = await supabase.from("profiles").update({ avatar_url: filePath }).eq("id", user.id);
        if (avatarUpdateError) throw avatarUpdateError;
        getProfile();
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  if (!user) return <Redirect to='/auth' />;
  return (
    <Layout>
      <div>Profile</div>
      {avatar_url && <img src={avatar_url} height='100' width='100' />}
      <div className='form-widget'>
        <div>
          <label htmlFor='email'>Email</label>
          <input id='email' type='text' value={user.email} disabled />
        </div>
        <div>
          <label htmlFor='username'>Name</label>
          <input id='username' type='text' value={username || ""} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor='website'>Website</label>
          <input id='website' type='website' value={website || ""} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div>
          <label className='button primary block' htmlFor='single'>
            {uploading ? "Uploading ..." : "Upload"}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type='file'
            id='single'
            accept='image/*'
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>

        <div>
          <button className='button block primary' onClick={() => updateProfile({ username, website })} disabled={loading}>
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
