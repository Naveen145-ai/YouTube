import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import share from '../../assets/share.png';
import dislike from '../../assets/dislike.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  // Fetch video info
  const fetchVideoData = async () => {
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
    const res = await fetch(videoDetailsUrl);
    const data = await res.json();
    setApiData(data.items?.[0]);
  };

  // Fetch channel and comment data
  const fetchOtherData = async () => {
    if (!apiData?.snippet?.channelId) return;

    const channelDataUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    const channelRes = await fetch(channelDataUrl);
    const channelJson = await channelRes.json();
    setChannelData(channelJson.items?.[0]);

    const commentDataUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&key=${API_KEY}`;
    const commentRes = await fetch(commentDataUrl);

    if (commentRes.ok) {
      const commentJson = await commentRes.json();
      setCommentData(commentJson.items || []);
    } else {
      setCommentData([]); // fallback if 403 error
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  return (
    <div className='play-video'>

      {/* Video Embed */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>

      {/* Title */}
      <h3>{apiData?.snippet?.title || "Title Here"}</h3>

      {/* Video Info */}
      <div className='play-video-info'>
        <p>
          {apiData
            ? `${value_converter(apiData.statistics?.viewCount)} Views • ${moment(apiData.snippet?.publishedAt).fromNow()}`
            : "Loading..."}
        </p>

        <div>
          <span><img src={like} alt="Like" /> {apiData ? value_converter(apiData.statistics?.likeCount) : "0"}</span>
          <span><img src={dislike} alt="Dislike" /> 👎</span>
          <span><img src={share} alt="Share" /> Share</span>
          <span><img src={save} alt="Save" /> Save</span>
        </div>
      </div>

      <hr />

      {/* Publisher Info */}
      <div className='publisher'>
        {channelData?.snippet?.thumbnails?.default?.url && (
          <img src={channelData.snippet.thumbnails.default.url} alt="Channel" />
        )}
        <div>
          <p>{apiData?.snippet?.channelTitle || ""}</p>
          <span>{channelData ? `${value_converter(channelData.statistics?.subscriberCount)} Subscribers` : "Subscribers"}</span>
        </div>
        <button>Subscribed</button>
      </div>

      {/* Description */}
      <div className='vid-description'>
        <p>{apiData?.snippet?.description.slice(0, 250) || "Description here"}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics?.commentCount) : "0"} comments</h4>

        {/* Comments */}
        {Array.isArray(commentData) && commentData.map((item, index) => (
          <div key={index} className='comment'>
            <img
              src={item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl || user_profile}
              alt="user"
            />
            <div>
              <h3>
                {item.snippet?.topLevelComment?.snippet?.authorDisplayName}
                <span> {moment(item.snippet?.topLevelComment?.snippet?.publishedAt).fromNow()}</span>
              </h3>
              <p>{item.snippet?.topLevelComment?.snippet?.textDisplay}</p>
              <div className='comment-action'>
                <img src={like} alt="like" />
                <span>{value_converter(item.snippet?.topLevelComment?.snippet?.likeCount || 0)}</span>
                <img src={dislike} alt="dislike" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
