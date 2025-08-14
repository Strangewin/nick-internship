import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";
import { Link } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import "./ItemDetails.css";

const ItemDetails = () => {
  const { id: nftId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchItemDetails = async () => {
      try {
        setLoading(true);

        const itemDetailsUrl = `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftid=${nftId}`;
        console.log("Trying itemDetails URL:", itemDetailsUrl);

        try {
          const { data } = await axios.get(itemDetailsUrl);

          if (data && Object.keys(data).length > 0) {
            setItemDetails(data);
            setError(null);
            return;
          }
        } catch (itemDetailsError) {}

        const alternatives = [
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`,
        ];

        for (let url of alternatives) {
          try {
            console.log("Trying alternative URL:", url);
            const { data } = await axios.get(url);
            console.log("Alternative API Response:", data);
            if (data && Object.keys(data).length > 0) {
              setItemDetails(data);
              setError(null);
              return;
            }
          } catch (altError) {
            console.log(
              "Alternative URL failed:",
              url,
              altError.response?.status
            );
          }
        }

        console.log("All itemDetails attempts failed, trying fallback...");

        try {
          const { data: hotCollectionsData } = await axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
          );
          console.log("HotCollections fallback data:", hotCollectionsData);

          const foundItem = hotCollectionsData.find(
            (item) =>
              item.nftId?.toString() === nftId || item.id?.toString() === nftId
          );

          if (foundItem) {
            setItemDetails(foundItem);
            setError(null);
            return;
          }
        } catch (fallbackError) {}

        setError("Item not found in any API");
      } catch (err) {
        setError("Error fetching item details");
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchItemDetails();
    } else {
      setError("No NFT ID provided");
      setLoading(false);
    }
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Loading item details...</h2>
                  <p>NFT ID: {nftId}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Error: {error}</h2>
                  <p>NFT ID: {nftId}</p>
                  <Link to="/" className="btn-main">
                    Go Back Home
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={itemDetails?.nftImage || nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={itemDetails?.title || "NFT"}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{itemDetails?.title || "Rainbow Style #194"}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {itemDetails?.views || itemDetails?.code || 100}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {itemDetails?.likes || 74}
                    </div>
                  </div>
                  <p>
                    {itemDetails?.description ||
                      `NFT ID: ${
                        itemDetails?.nftId || itemDetails?.id || nftId
                      } | 
                    A unique digital collectible from the ${
                      itemDetails?.title
                    } collection.`}
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${
                              itemDetails?.ownerId || itemDetails?.authorId
                            }`}
                          >
                            <img
                              className="lazy"
                              src={
                                itemDetails?.ownerImage ||
                                itemDetails?.authorImage ||
                                AuthorImage
                              }
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link
                            to={`/author/${
                              itemDetails?.ownerId || itemDetails?.authorId
                            }`}
                          >
                            {itemDetails?.ownerName ||
                              itemDetails?.authorName ||
                              `Owner #${
                                itemDetails?.ownerId ||
                                itemDetails?.authorId ||
                                "Unknown"
                              }`}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${
                              itemDetails?.creatorId || itemDetails?.authorId
                            }`}
                          >
                            <img
                              className="lazy"
                              src={
                                itemDetails?.creatorImage ||
                                itemDetails?.authorImage ||
                                AuthorImage
                              }
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link
                            to={`/author/${
                              itemDetails?.creatorId || itemDetails?.authorId
                            }`}
                          >
                            {itemDetails?.creatorName ||
                              itemDetails?.authorName ||
                              `Creator #${
                                itemDetails?.creatorId ||
                                itemDetails?.authorId ||
                                "Unknown"
                              }`}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>
                        {itemDetails?.price || itemDetails?.code / 100 || 1.85}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
