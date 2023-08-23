import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import listIcon from "../public/icons/list.svg";
import infoIcon from "../public/icons/info.svg";
import historyIcon from "../public/icons/history.svg";
import helpIcon from "../public/icons/help.svg";
import Modal from "./component/modal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { db, storage } from "../firebase/initFireBase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";

export default function Home() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [remainingGuesses, setRemainingGuesses] = useState(9);
  const [curGuess, setCurGuess] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);

  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, "images/");
  const [listOneData, setListOneData] = useState({
    actualPrice: 800,
    baths: 2,
    beds: 2,
    built: 2,
    listDate: "2023-08-23",
    listPrice: 33,
    location: "Ross",
    lotSize: 222,
    propertyType: "w",
    sqft: 10,
  });

  const openInfo = () => {
    setInfoOpen(true);
  };

  const closeInfo = () => {
    setInfoOpen(false);
  };
  const openHistory = () => {
    setHistoryOpen(true);
  };

  const closeHistory = () => {
    setHistoryOpen(false);
  };
  const openHelp = () => {
    setHelpOpen(true);
  };

  const closeHelp = () => {
    setHelpOpen(false);
  };
  const handleGuess = () => {
    if (!userGuess) {
      // Check if the user guess is empty
      return;
    }

    setCurGuess(userGuess);
    const guess = parseInt(curGuess);

    if (guess === listOneData.actualPrice) {
      setFeedbackMessage("🏡 You win!");
    } else {
      const difference = Math.abs(guess - listOneData.actualPrice);
      const percentDifference = (difference / listOneData.actualPrice) * 100;

      if (percentDifference <= 10) {
        if (guess > listOneData.actualPrice) {
          setFeedbackMessage("↘️");
        } else {
          setFeedbackMessage("↗️");
        }
      } else if (guess > listOneData.actualPrice) {
        setFeedbackMessage("⬇️");
      } else {
        setFeedbackMessage("⬆️");
      }
    }

    setRemainingGuesses(remainingGuesses - 1);
    const gameState = {
      remainingGuesses: remainingGuesses,
      curGuess: curGuess,
      feedbackMessage: feedbackMessage,
      // Add other state variables you want to store here
    };

    // Convert the gameState object to a JSON string and save it to local storage
    localStorage.setItem("gameState", JSON.stringify(gameState));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserGuess(value);

    // Check if the value is numeric
    const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
    setInvalidInput(!isNumeric);
  };

  const [imageUrlsFetched, setImageUrlsFetched] = useState(false);
  useEffect(() => {
    function fetchImage() {
      if (!imageUrlsFetched) {
        listAll(imageListRef)
          .then((response) => Promise.all(response.items.map(getDownloadURL)))
          .then((urls) => {
            setImageList(urls);
            setImageUrlsFetched(true); // Mark image URLs as fetched
          })
          .catch((error) => {
            console.error("Error fetching image URLs:", error);
          });
      }
    }
    fetchImage();
  }, [imageUrlsFetched]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "olist", "olisddoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setListOneData(data);
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    // Call the fetchDocument function to fetch the document
    fetchDocument();
  }, []);
  useEffect(() => {
    // Load the gameState JSON string from local storage
    const savedGameState = localStorage.getItem("gameState");

    if (savedGameState) {
      // Parse the JSON string to get the gameState object
      const parsedGameState = JSON.parse(savedGameState);

      // Update the state with the saved game state
      setRemainingGuesses(parsedGameState.remainingGuesses);
      setCurGuess(parsedGameState.curGuess);
      setFeedbackMessage(parsedGameState.feedbackMessage);
      // Update other state variables as needed
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full mx-auto pt-4 md:pt-0 md:w-2/6">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between w-full ">
        <nav className="flex space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            <Image priority src={listIcon} alt="list" height={32} width={32} />
          </Link>
          <div className="text-gray-600 hover:text-gray-800" onClick={openInfo}>
            <Image priority src={infoIcon} alt="info" height={32} width={32} />
          </div>
        </nav>
        <h1 className="text-4xl font-bold text-gray-800">LISTED</h1>
        <nav className="flex space-x-4">
          <div
            className="text-gray-600 hover:text-gray-800"
            onClick={openHistory}
          >
            <Image
              priority
              src={historyIcon}
              alt="history"
              height={32}
              width={32}
            />
          </div>
          <div className="text-gray-600 hover:text-gray-800" onClick={openHelp}>
            <Image priority src={helpIcon} alt="help" height={32} width={32} />
          </div>
        </nav>
      </header>

      <Carousel autoPlay={true} showThumbs={false}>
        {imageList.map((imageUrl, index) => (
          <div key={index} className="h-72">
            <Image
              loader={() => imageUrl}
              src={imageUrl}
              width={50}
              height={50}
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </Carousel>

      <div className="w-full flex  mt-4">
        <div className="flex-1 space-y-4">
          <div>
            <h1
              style={{
                textShadow:
                  remainingGuesses <= 8 ? "none" : `0 0 ${15}px black`,
                color: remainingGuesses <= 8 ? "#000" : `transparent`,
              }}
              className="font-bold "
            >
              {listOneData.location}
            </h1>
            <h1 className="text-sm text-[#407082] mb-1">Location</h1>
          </div>
          <div className="flex space-x-2">
            <div>
              <h1
                style={{
                  textShadow:
                    remainingGuesses <= 6 ? "none" : `0 0 ${15}px black`,
                  color: remainingGuesses <= 6 ? "#000" : `transparent`,
                }}
                className="font-bold"
              >
                {listOneData.beds}
              </h1>
              <h1 className="text-sm  text-[#407082] mb-4">Beds</h1>
            </div>
            <div>
              <h1
                style={{
                  textShadow:
                    remainingGuesses <= 6 ? "none" : `0 0 ${15}px black`,
                  color: remainingGuesses <= 6 ? "#000" : `transparent`,
                }}
                className="font-bold"
              >
                {listOneData.baths}
              </h1>
              <h1 className="text-sm text-[#407082] mb-4">Baths</h1>
            </div>
            <div>
              <h1
                style={{
                  textShadow:
                    remainingGuesses <= 5 ? "none" : `0 0 ${15}px black`,
                  color: remainingGuesses <= 5 ? "#000" : `transparent`,
                }}
                className="font-bold"
              >
                {listOneData.built}
              </h1>
              <h1 className="text-sm text-[#407082] ">Built</h1>
            </div>
          </div>
          <div>
            <h1
              style={{
                textShadow:
                  remainingGuesses <= 2 ? "none" : `0 0 ${15}px black`,
                color: remainingGuesses <= 2 ? "#000" : `transparent`,
              }}
              className="font-bold"
            >
              {listOneData.listDate}
            </h1>
            <h1 className="text-sm text-[#407082] mb-4">List Date</h1>
          </div>
        </div>

        <div className="flex-1 ">
          <div>
            <h1
              style={{
                textShadow:
                  remainingGuesses <= 7 ? "none" : `0 0 ${15}px black`,
                color: remainingGuesses <= 7 ? "#000" : `transparent`,
              }}
              className="font-bold mb-1"
            >
              {listOneData.propertyType}
            </h1>
            <h1 className="text-sm  text-[#407082] mb-4">Property Type</h1>
          </div>
          <div className="flex space-x-2">
            <div>
              <h1
                style={{
                  textShadow:
                    remainingGuesses <= 4 ? "none" : `0 0 ${15}px black`,
                  color: remainingGuesses <= 4 ? "#000" : `transparent`,
                }}
                className="font-bold"
              >
                {listOneData.sqft}
              </h1>
              <h1 className="text-sm text-[#407082] mb-4">Sqft</h1>
            </div>
            <div>
              <h1
                style={{
                  textShadow:
                    remainingGuesses <= 3 ? "none" : `0 0 ${15}px black`,
                  color: remainingGuesses <= 3 ? "#000" : `transparent`,
                }}
                className="font-bold"
              >
                {listOneData.lotSize}
              </h1>
              <h1 className="text-sm text-[#407082] mb-4">Lot Size</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <div>
              <h1
                style={{
                  textShadow:
                    remainingGuesses <= 1 ? "none" : `0 0 ${15}px black`,
                  color: remainingGuesses <= 1 ? "#000" : `transparent`,
                }}
                className="font-bold"
              >{`US$${listOneData.listPrice}`}</h1>
              <h1 className="text-sm text-[#407082] mb-4">List Price</h1>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ display: remainingGuesses <= 0 ? "none" : "flex" }} // Flex display when guesses are remaining
        className="mt-2 text-center mt-6 w-full flex space-x-4"
      >
        <div className="flex-none">
          {remainingGuesses < 9 && `Guess ${remainingGuesses}`}
        </div>
        <div className="flex-none text-center">
          {curGuess !== "" && `US$${curGuess}`}
        </div>

        <div className="flex-grow">
          {feedbackMessage !== "" && `Next Guess ${feedbackMessage}`}
        </div>
      </div>

      <div
        style={{ display: remainingGuesses <= 0 ? "none" : "flex" }}
        className=" w-full space-x-2 "
      >
        <input
          type="text"
          placeholder="Guess That Price"
          onChange={handleInputChange}
          className={`border border-gray-300 w-3/4 px-4 py-2 rounded-l-lg ${
            invalidInput ? "border-red-500" : ""
          }`}
          title={invalidInput ? "Please enter a valid number" : ""}
        />
        <button
          type="button"
          onClick={handleGuess}
          className="bg-[#508EA4] text-black px-4 py-2 w-1/4 rounded-lg hover:bg-primary-600 focus:outline-none focus:bg-primary-600"
          disabled={invalidInput}
        >
          Guess
        </button>
      </div>

      <div
        style={{ display: remainingGuesses <= 0 ? "block" : "none" }}
        class="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
      >
        <div class="mb-2 text-xl font-medium text-center leading-tight text-neutral-800 dark:text-neutral-50">
          {` Sold for: $${listOneData.actualPrice}`}
        </div>

        <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
          Too bad - try again tommorrow
        </p>

        <button
          type="button"
          class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        >
          SHARE
        </button>
      </div>

      <Modal isOpen={infoOpen} onClose={closeInfo} buttonText="THANKS!">
        <div>
          🏡 ABOUT LISTED 🏡 Listed is a passion project built and designed by
          Potch and Andrew Pariser, two friends trying to make it big on the
          heels of the Wordle train. If you want to support future entertaining
          products like this, consider buying us a coffee or contacting us with
          your feedback, suggestions, or random observations. Follow us:
          Facebook · Instagram · Twitter
        </div>
      </Modal>
      <Modal isOpen={helpOpen} onClose={closeHelp} buttonText="PLAY">
        <div>
          {` 🏡 WELCOME TO LISTED 🏡 In this game, your goal is to guess the sale
          price of a recently sold property After each guess, you learn more
          about the property, and get feedback about your guess: ⬆️ Guess much
          higher next time ↗️ Guess a little higher next time 🏡 You win! ↘️
          Guess a little lower next time ⬇️ Guess much lower next time ↗️ or ↘️?
          You're within 10%! Get within 1% to win`}
        </div>
      </Modal>
      <Modal isOpen={historyOpen} onClose={closeHistory} buttonText="DONE">
        <div>
          🏡 LISTED STATS 🏡 0 Win Streak 1 Longest Streak 1 Play Streak 1
          Longest Play Streak 1 1 1 2 3 4 5 6 7 8 9 ❌ 2 Games Played
        </div>
      </Modal>
    </div>
  );
}
