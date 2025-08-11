import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import OwlCarousel from 'react-owl-carousel';
import './NewItems.css';

const owlOptions = {
  loop: true,
  margin: 20,
  nav: true,
  dots: false,
  responsive: {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 4 }
  }
};


const Countdown = ({ expiry }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiry));

  useEffect(() => {
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
};

function getTimeLeft(expiry) {
  const total = Math.max(0, expiry - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60));
  return { total, hours, minutes, seconds };
}

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems");
       
        setItems(data);
      } catch (error) {
        setItems([]); 
        console.error("Error fetching new items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

return (
  <section id="section-items" className="no-bottom">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>
        </div>

        {loading ? (
          <div className="row">
            {new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 mb-4" key={index}>
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
            ))}
          </div>
        ) : (
          <OwlCarousel className="owl-theme" {...owlOptions}>
            {items.map((item, index) => (
              <div className="item" key={item.id || index}>
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

                  <Countdown expiry={item.expiryDate} />

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
          </OwlCarousel>
        )}
      </div>
    </div>
  </section>
);};

export default NewItems;