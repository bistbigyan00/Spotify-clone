import { useCallback, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';
import { debounce } from 'lodash';

function Player() {
    // importing needed things
    const spotifyApi = useSpotify();
    
    const { data: session, status }= useSession();
    
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const [volume, setVolume] = useState(50);
    // from custom hooks
    const songInfo = useSongInfo();

    // if songs is already playing but we refershed, so songInfo will be null again
    const fetchPlayingSongDetails = () =>{
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then((data)=>{
                console.log("Now playing track: ",data.body?.item);
                // set this thing globally
                setCurrentTrackId(data.body?.item?.id);
            })

            spotifyApi.getMyCurrentPlaybackState().then((data)=>{
                // set this thing globally
                setIsPlaying(data.body?.is_playing);
            })
        }
    };

    // when clicking play or pause icon
    const handlePlayPause = () =>{
        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play();
                setIsPlaying(true)
            }
        });
    };

    // if song is already clicked and we refreshed, capture that song details to play again
    useEffect (()=>{
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchPlayingSongDetails();
        }
    },[currentTrackId, spotifyApi, session])

    // if volume changes, set the new volume 
    useEffect (()=>{
        if(volume > 0 && volume < 100){
            debounceAdjustVolume(volume);
        }
    },[volume])

    // special function to control the volume, it takes the volume and then sets the volume
    const debounceAdjustVolume = useCallback(
        debounce((volume)=>{
            spotifyApi.setVolume(volume);
        },500),[]
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-x5 md:text-base px-2 md:px-8">
            
            {/* left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
               
               {/* is broken from spotify API */}
                <RewindIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>

                 {isPlaying ? (
                     <PauseIcon onClick={handlePlayPause} className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                 ): (
                    <PlayIcon onClick={handlePlayPause} className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                 )}

                {/* is broken from spotify API */}
                 <FastForwardIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                
                 <ReplyIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
            </div>

            {/* right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeOffIcon onClick={()=>volume>0 && setVolume(volume-10)} className="w-5 h-5"/>

                {/* slider for volume */}
                <input 
                    className="w-14 md:w-28" 
                    type="range" 
                    value={volume} 
                    onChange={(e)=>setVolume(Number(e.target.value))} 
                    min={0} 
                    max={100}
                />
                <VolumeUpIcon onClick={()=>volume<100 && setVolume(volume+10)} className="w-5 h-5"/>
            </div>
        </div>
    )
}

export default Player
