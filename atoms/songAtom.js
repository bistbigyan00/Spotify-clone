import { atom } from 'recoil';

// which song is clicked
export const currentTrackIdState = atom({
    key: "currentTrackIdState",
    default:null,
});

// is it playing or not
export const isPlayingState = atom({
    key:"isPlayingState",
    default: false,
})
 