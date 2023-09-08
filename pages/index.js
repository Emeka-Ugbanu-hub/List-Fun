import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Modal from "./component/modal";
import DarkModeToggle from "./component/DarkModeToggle";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { db, storage } from "../firebase/initFireBase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { getURL } from "next/dist/shared/lib/utils";

export default function Home() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [remainingGuesses, setRemainingGuesses] = useState(9);
  const [curGuess, setCurGuess] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [imageList, setImageList] = useState([]);
  const [winner, setWinner] = useState(false);
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
    const guess = parseInt(userGuess);

    if (guess === listOneData.actualPrice) {
      setFeedbackMessage("🏡 You win!");
      setWinner(true);
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
      setWinner(parsedGameState.winner);
      // Update other state variables as needed
    }
  }, []);

  useEffect(() => {
    // Save the current user guess to local storage whenever curGuess changes
    const gameState = {
      remainingGuesses: remainingGuesses,
      curGuess: curGuess,
      feedbackMessage: feedbackMessage,
      winner: winner,
      // Add other state variables you want to store here
    };

    // Convert the gameState object to a JSON string and save it to local storage
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [curGuess, feedbackMessage, remainingGuesses, winner]);

  useEffect(() => {
    // Apply dark mode styles when darkMode state changes
    if (darkMode) {
      // Apply dark mode styles
      document.documentElement.style.background = "#fff";
      document.documentElement.style.backgroundImage = "linear-gradient(#000, #000)";
      document.documentElement.style.color = "#fff";
    } else {
      // Remove dark mode styles
      document.documentElement.style.background = "#000";
      document.documentElement.style.backgroundImage = "linear-gradient(#fff, #fff)";
      document.documentElement.style.color = "#000";
    }
  }, [darkMode]);
  const toggleDarkMode = (mode) => {
    setDarkMode(mode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full mx-auto pt-4 md:pt-0 md:w-2/6">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between  w-10/12 lg:w-full  ">
        <nav className="flex space-x-4">
          <div
            className="text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={openInfo}
          >
            <svg
              className="icon icon--about w-8 h-8"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill={` ${darkMode ? "#fff" : "#000"} `} fill-rule="evenodd">
                <circle cx="64" cy="37" r="8" />
                <path
                  d="M64 2c34.242 0 62 27.758 62 62 0 34.242-27.758 62-62 62-34.242 0-62-27.758-62-62C2 29.758 29.758 2 64 2Zm0 12c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50-22.386-50-50-50Z"
                  fill-rule="nonzero"
                />
                <path fill-rule="nonzero" d="M70 53v39h6v8H52v-8h6V61h-6v-8z" />
              </g>
            </svg>
          </div>
          <DarkModeToggle toggleDarkMode={toggleDarkMode} />
        </nav>
        <h1
          className={`text-4xl cursor-pointer font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }  `}
        >
          LISTED
        </h1>
        <nav className="flex space-x-4">
          <div
            className="text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={openHistory}
          >
            <svg
              className="icon icon--stats w-8 h-8"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill={` ${darkMode ? "#fff" : "#000"} `} fill-rule="evenodd">
                <path d="M19 48h22v65H19zM53 62h22v51H53zM87 21h22v92H87z" />
              </g>
            </svg>
          </div>

          <div
            className="text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={openHelp}
          >
            <svg
              class="icon icon--help w-8 h-8"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill={` ${darkMode ? "#fff" : "#000"} `} fill-rule="evenodd">
                <path
                  d="M64 2c34.242 0 62 27.758 62 62 0 34.242-27.758 62-62 62-34.242 0-62-27.758-62-62C2 29.758 29.758 2 64 2Zm0 12c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50-22.386-50-50-50Z"
                  fill-rule="nonzero"
                />
                <circle cx="64" cy="98" r="8" />
                <path
                  d="M64 25c13.737 0 26 11.037 26 25 0 9.668-2.916 15.943-10.354 20.721l-.648.406c-1.87 1.14-4.009 2.195-6.44 3.192l-.87.35c-.295.115-.593.23-.895.344l-.794.294L70 84H58V66.589l4.644-1.452.844-.27.814-.266 1.165-.394.74-.26.712-.257 1.015-.384.643-.255.616-.255.59-.255.564-.255c.183-.085.363-.17.538-.257l.515-.258.49-.26.236-.13.455-.265c3.105-1.857 4.535-3.944 5.102-6.956l.075-.437c.012-.074.023-.148.033-.223l.059-.457.025-.233.043-.477c.007-.081.013-.162.018-.244l.029-.5.02-.514.011-.53C78 50.367 78 50.186 78 50c0-7.037-6.625-13-14-13-7.097 0-12.522 5.525-12.044 13.181l.023.32-11.958.997C38.775 36.548 49.91 25 64 25Z"
                  fill-rule="nonzero"
                />
              </g>
            </svg>
          </div>
        </nav>
      </header>

      <Carousel autoPlay={false} showThumbs={false}>
        {imageList.map((imageUrl, index) => (
          <div
            key={index}
            className="h-72  w-10/12 mt-4 ml-8 lg:ml-0 lg:w-full bg-white"
          >
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

      <div className=" w-10/12 ml-8 lg:ml-0 lg:w-full flex  mt-4">
        <div className="flex-1 space-y-4">
          <div>
            <h1
              style={{
                textShadow:
                  remainingGuesses <= 8
                    ? "none"
                    : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                color:
                  remainingGuesses <= 8
                    ? `${darkMode ? "white" : "black"}`
                    : `transparent`,
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
                    remainingGuesses <= 6
                      ? "none"
                      : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                  color:
                    remainingGuesses <= 6
                      ? `${darkMode ? "white" : "black"}`
                      : `transparent`,
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
                    remainingGuesses <= 6
                      ? "none"
                      : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                  color:
                    remainingGuesses <= 6
                      ? `${darkMode ? "white" : "black"}`
                      : `transparent`,
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
                    remainingGuesses <= 5
                      ? "none"
                      : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                  color:
                    remainingGuesses <= 5
                      ? `${darkMode ? "white" : "black"}`
                      : `transparent`,
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
                  remainingGuesses <= 2
                    ? "none"
                    : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                color:
                  remainingGuesses <= 2
                    ? `${darkMode ? "white" : "black"}`
                    : `transparent`,
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
                  remainingGuesses <= 7
                    ? "none"
                    : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                color:
                  remainingGuesses <= 7
                    ? `${darkMode ? "white" : "black"}`
                    : `transparent`,
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
                    remainingGuesses <= 4
                      ? "none"
                      : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                  color:
                    remainingGuesses <= 4
                      ? `${darkMode ? "white" : "black"}`
                      : `transparent`,
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
                    remainingGuesses <= 3
                      ? "none"
                      : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                  color:
                    remainingGuesses <= 3
                      ? `${darkMode ? "white" : "black"}`
                      : `transparent`,
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
                    remainingGuesses <= 1
                      ? "none"
                      : `0 0 ${15}px ${darkMode ? "white" : "black"}`,
                  color:
                    remainingGuesses <= 1
                      ? `${darkMode ? "white" : "black"}`
                      : `transparent`,
                }}
                className="font-bold"
              >{`US$${listOneData.listPrice}`}</h1>
              <h1 className="text-sm text-[#407082] mb-4">List Price</h1>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ display: winner ? "none" : "flex" }} // Flex display when guesses are remaining
        className="mt-2 text-center mt-6 w-10/12 lg:w-full  flex space-x-4"
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
        style={{ display: winner ? "none" : "flex" }}
        className=" w-10/12 lg:w-full space-x-2 "
      >
        <input
          type="text"
          placeholder="Guess That Price"
          onChange={handleInputChange}
          className={`border border-gray-300 w-3/4 text-black px-4 py-2 rounded-l-lg ${
            invalidInput ? "border-red-500" : ""
          }   bg-white text-black`}
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
        style={{ display: winner ? "block" : "none" }}
        class="block w-10/12 rounded-lg bg-white p-6 border border-amber-300 "
      >
        <div class="mb-2 text-xl font-medium text-center leading-tight text-neutral-800 dark:text-neutral-50">
          {` Sold for: $${listOneData.actualPrice}`}
        </div>

        <p class="mb-4 text-base text-center text-neutral-600 ">
          {winner ? "Winner" : " Too bad - try again tommorrow"}
        </p>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            class="inline-block rounded bg-amber-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white "
          >
            SHARE
          </button>
        </div>
      </div>

      <Modal isOpen={infoOpen} onClose={closeInfo} buttonText="THANKS!">
        <div
          className={`text-center ${darkMode ? "text-black" : "text-black"} `}
        >
          <div> 🏡 ABOUT LISTED 🏡 </div>
          <div>
            Listed is a passion project built and designed by Potch and Andrew
            Pariser, two friends who make things. Occasionally.
          </div>
          <div>
            If you enjoy this game and want to support future entertaining
            projects like this, consider supporting us or contacting us with
            your feedback, suggestions, or random observations.
          </div>
          <div>Follow us: Facebook · Instagram · Twitter</div>
        </div>
      </Modal>
      <Modal isOpen={helpOpen} onClose={closeHelp} buttonText="PLAY">
        <div
          className={`text-center  ${darkMode ? "text-black" : "text-black"} `}
        >
          <div> 🏡 WELCOME TO LISTED 🏡 </div>
          <div>
            {" "}
            In this game, your goal is to guess the sale price of a recently
            sold property
          </div>
          <div>
            {" "}
            After each guess, you learn more about the property, and get
            feedback about your guess:
          </div>
          <div>⬆️ Guess much higher next time</div>
          <div>↗️ Guess a little higher next time</div>
          <div>🏡 You win!</div> <div>↘️ Guess a little lower next time</div>
          <div>⬇️ Guess much lower next time</div>
          <div>↗️ or ↘️? You are within 10%! or $10,000!</div>
          <div>Get within 1% or $5,000 to win</div>
        </div>
      </Modal>
      <Modal isOpen={historyOpen} onClose={closeHistory} buttonText="DONE">
        <div
          className={` text-center ${darkMode ? "text-black" : "text-black"}`}
        >
          <div>🏡 LISTED STATS 🏡</div>
        </div>
      </Modal>
    </div>
  );
}
