import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import './TopSellers.css';


const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSellers = async () => {
    try {
      const res = await fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers");
      const data = await res.json();
      setSellers(data);
    } catch (error) {
      setSellers([]);
      console.error("Error fetching top sellers:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchSellers();
}, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ? new Array(12).fill(0).map((_, index) => (
                    <li key={index}>
                      <div className="author_list_pp">
                        <div className="skeleton-circle skeleton-shimmer" style={{ width: 50, height: 50 }} />
                      </div>
                      <div className="author_list_info">
                        <div className="skeleton-text skeleton-shimmer" style={{ width: "80px", height: "16px", marginBottom: "6px" }} />
                        <div className="skeleton-text skeleton-shimmer" style={{ width: "40px", height: "14px" }} />
                      </div>
                    </li>
                  ))
                : sellers.map((seller, index) => (
                    <li key={seller.id || index}>
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={seller.authorImage || AuthorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${seller.authorId}`}>{seller.authorName || "Unknown"}</Link>
                        <span>{seller.price || "0"} ETH</span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;