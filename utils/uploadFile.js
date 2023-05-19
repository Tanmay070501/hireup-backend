const firebase = require("./firebase");
const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
} = require("firebase/storage");

const giveCurrentDateTime = () => {
    const today = new Date();
    const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
    const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
};

module.exports.uploadFile = async (location, file) => {
    if (!file) throw new Error("File missing!");
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
        firebase.storage,
        `files/${location}/${file.originalname + " " + dateTime + ".pdf"}`
    );

    // Create file metadata including the content type
    console.log(file);
    const metadata = {
        contentType: file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};
