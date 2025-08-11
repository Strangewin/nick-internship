import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0,0);
    const fetchAuthor = async () => {
      try {
        const url = `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`;
        const res = await fetch(url);
        const data = await res.json();
        setAuthor(data);

        setFollowerCount(data.followers || 0);
        const followedAuthors =
          JSON.parse(localStorage.getItem("followedAuthors")) || {};
        setIsFollowing(!!followedAuthors[authorId]);
      } catch (error) {
        setAuthor(null);
        setFollowerCount(0);
        setIsFollowing(false);
        console.error("Error fetching author:", error);
      } finally {
        setLoading(false);
      }
    };
    if (authorId) {
      setLoading(true);
      fetchAuthor();
    }
  }, [authorId]);

  const handleFollowToggle = () => {
    const followedAuthors =
      JSON.parse(localStorage.getItem("followedAuthors")) || {};

    if (isFollowing) {
      setFollowerCount((count) => count - 1);
      delete followedAuthors[authorId];
      setIsFollowing(false);
    } else {
      setFollowerCount((count) => count + 1);
      followedAuthors[authorId] = true;
      setIsFollowing(true);
    }

    localStorage.setItem("followedAuthors", JSON.stringify(followedAuthors));
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
       

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading ? (
                        <>
                          <div className="skeleton-circle skeleton-shimmer" style={{ width: 120, height: 120, marginBottom: 10 }} />
                          <div className="skeleton-text skeleton-shimmer" style={{ width: 180, height: 28, marginBottom: 8 }} />
                          <div className="skeleton-text skeleton-shimmer" style={{ width: 120, height: 18, marginBottom: 8 }} />
                          <div className="skeleton-text skeleton-shimmer" style={{ width: 160, height: 18 }} />
                        </>
                      ) : (
                        <>
                          <img src={author?.authorImage || AuthorImage} alt="" />
                          <i className="fa fa-check"></i>
                          <div className="profile_name">
                            <h4>
                              {author?.authorName || "Unknown"}
                              <span className="profile_username">
                                @{author?.tag || "unknown"}
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                <span id="wallet" className="profile_wallet">
                                  {author?.address || author?.walletAddress || ""}
                                </span>
                                <button
                                  id="btn_copy"
                                  title="Copy Wallet Address"
                                  onClick={() => {
                                    const wallet = author?.address || author?.walletAddress;
                                    if (wallet) {
                                      navigator.clipboard.writeText(wallet);
                                    }
                                  }}
                                >
                                  Copy
                                </button>
                              </div>
                            </h4>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      {loading ? (
                        <div className="skeleton-text skeleton-shimmer" style={{ width: 80, height: 18, marginBottom: 8 }} />
                      ) : (
                        <div className="profile_follower">
                          {followerCount} followers
                        </div>
                      )}
                      {loading ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ width: 100, height: 36 }} />
                      ) : (
                        <button className="btn-main" onClick={handleFollowToggle}>
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems author={author} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
