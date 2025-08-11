import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const AuthorItems = () => {
  const { authorId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthorItems = async () => {
      try {
        const url = `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`;
        const res = await fetch(url);
        const data = await res.json();

        setAuthor(data); // Save author profile data
        if (data && data.nftCollection && Array.isArray(data.nftCollection)) {
          setItems(data.nftCollection);
        } else {
          setItems([]);
        }
      } catch (error) {
        setItems([]);
        setAuthor(null);
        console.error("Error fetching author items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      setLoading(true);
      fetchAuthorItems();
    } else {
      setLoading(false);
    }
  }, [authorId]);

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {loading
            ? new Array(8).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <div className="skeleton-circle skeleton-shimmer" style={{ width: 50, height: 50 }} />
                    </div>
                    <div className="nft__item_wrap">
                      <div className="skeleton-box skeleton-shimmer" style={{ width: "100%", height: "180px", borderRadius: "12px" }} />
                    </div>
                    <div className="nft__item_info">
                      <div className="skeleton-text skeleton-shimmer" style={{ width: "60%", height: "20px", marginBottom: "8px" }} />
                      <div className="skeleton-text skeleton-shimmer" style={{ width: "40%", height: "16px" }} />
                    </div>
                  </div>
                </div>
              ))
            : items.map((item, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.nftId || index}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link to="">
                        <img
                          className="lazy"
                          src={(author && author.authorImage) || AuthorImage}
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <Link to={`/item-details/${item.nftId}`}>
                        <img
                          src={item.nftImage || nftImage}
                          className="lazy nft__item_preview"
                          alt={item.title || ""}
                        />
                      </Link>
                    </div>
                    <div className="nft__item_info">
                      <Link to={`/item-details/${item.nftId}`}>
                        <h4>{item.title || (author && author.authorName) || "Untitled"}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price || "0"} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes || 0}</span>
                      </div>
                      {/* Dynamic author tag and followers */}
                      {author && (
                        <>
                          <div className="author-tag">@{author.tag || "unknown"}</div>
                          <div className="author-followers">{author.followers || 0} followers</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
