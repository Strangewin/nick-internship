import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import './ExploreItems.css';

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
        if (filter) {
          url += `?filter=${filter}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setItems(data);
        setVisibleCount(8); 
      } catch (error) {
        setItems([]);
        console.error("Error fetching explore items:", error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchItems();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount((prev) => Math.min(prev + 4, items.length));
  };

  function Countdown({ expiry }) {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiry));

    useEffect(() => {
      if (!expiry) return;
      const timer = setInterval(() => {
        setTimeLeft(getTimeLeft(expiry));
      }, 1000);
      return () => clearInterval(timer);
    }, [expiry]);

    if (timeLeft.total <= 0) return <span className="de_countdown">Expired</span>;

    return (
      <span className="de_countdown">
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    );
  }

  function getTimeLeft(expiry) {
    const total = Math.max(0, expiry - Date.now());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60));
    return { total, hours, minutes, seconds };
  }

  return (
    <>
      <div>
        <select id="filter-items" value={filter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <div className="row">
        {loading
          ? new Array(8).fill(0).map((_, index) => (
              <div
                key={index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <div className="skeleton-circle skeleton-shimmer" />
                  </div>
                  <div className="de_countdown skeleton-text skeleton-shimmer" style={{ width: "80px", height: "18px" }} />
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
          : items.slice(0, visibleCount).map((item, index) => (
              <div
                key={item.id || index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={`Creator: ${item.authorName || "Unknown"}`}
                    >
                      <img className="lazy" src={item.authorImage || AuthorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  {item.expiryDate ? <Countdown expiry={item.expiryDate} /> : ""}
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
                      <img src={item.nftImage || nftImage} className="lazy nft__item_preview" alt={item.title || ""} />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title || "Untitled"}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price || "0"} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <div className="col-md-12 text-center">
        {visibleCount < items.length && (
          <Link to="" id="loadmore" className="btn-main lead" onClick={handleLoadMore}>
            Load more
          </Link>
        )}
      </div>
    </>
  );
};

export default ExploreItems;
