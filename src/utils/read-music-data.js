import { PermissionsAndroid } from "react-native";
import MusicFiles from "react-native-get-music-files";
import RNFS from "react-native-fs";

const FetchFromLib = (callback) => {
  MusicFiles.getAll({ cover: true })
    .then(callback)
    .catch((error) => {
      console.log(error);
      callback([]);
    });
};

const ReadMusicData = (callback) => {
  PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ]).then(() => {
    const path = RNFS.DocumentDirectoryPath + "/data.json";
    RNFS.exists(path).then((exists) => {
      if (exists) {
        RNFS.readFile(path, "utf8")
          .then((tracks) => callback(JSON.parse(tracks)))
          .catch((err) => console.log(err.message));
      } else {
        FetchFromLib((tracks) => {
          RNFS.writeFile(path, JSON.stringify(tracks), "utf8")
            .then(() => console.log("FILE WRITTEN!"))
            .catch((err) => console.log(err.message));
          callback(tracks);
        });
      }
    });
  });
};

export default ReadMusicData;
