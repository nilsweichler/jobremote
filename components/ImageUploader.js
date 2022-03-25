import {useState} from 'react';
import {auth, storage, STATE_CHANGED, firestore, getUserWithUID, postToJSON} from '../lib/firebase';
import Loader from './Loader';
import toast from "react-hot-toast";


// Uploads images to Firebase Storage
export default function ImageUploader(props) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);
    let PicURL;

    // Creates a Firebase Upload Task
    const uploadFile = async (e) => {
        // Get the file
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        // Makes reference to the storage bucket location
        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const task = ref.put(file);

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(pct);

            // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
            task
                .then((d) => ref.getDownloadURL())
                .then((url) => {
                    setDownloadURL(url);
                    PicURL = url;
                    setUploading(false);
                    updatePic();
                });
        });
    };

    const updatePic = async () => {
        const userRef = firestore.collection('users').doc(auth.currentUser.uid);
        console.log(PicURL)
        await userRef.update({
            photoURL: PicURL
        });

        toast.success('Profile Picture updated successfully!')
    };



    return (
        <>
            <div className="box">
                <Loader show={uploading} />
                {uploading && <h3>{progress}%</h3>}

                {!uploading && (
                    <>
                        <label className="btn">
                            📸 Upload Img
                            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
                        </label>
                    </>
                )}
            </div>
        </>
    );
}