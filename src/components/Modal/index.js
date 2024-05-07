import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./modal.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
// import { ChangeLibraryItem, deleteLibraryItem, getMark } from "./handleModal";
import * as handleModal from "./handleModal";
const STATUS = ["Watching", "Completed", "Planning", "Dropped"];

function Modal({ anime, onClose }) {
  const location = useLocation();
  const [status, setStatus] = useState(STATUS[0]);
  const [note, setNote] = useState("");
  const [values, setValues] = useState({
    library_id: null,
    status: "Watching",
    note: "",
  });
  const userTokenName = Cookies.get(process.env.REACT_APP_JWT_TOKEN);
  const user_id = Cookies.get(process.env.REACT_APP_USER_TOKEN);
  const anime_id = anime.mal_id || anime.anime_id;
  useEffect(() => {
    handleModal.getMark(user_id, anime_id).then((library) => {
      if (library) {
        setValues(library);
        setStatus(library.status);
      }
    });
  }, [user_id]);
  const handleSaveMark = async (e) => {
    e.preventDefault();
    const value = {
      status,
      note,
      user_id,
      anime_title: anime.title || anime.anime_title,
      anime_id: anime.mal_id || anime.anime_id,
      anime_image: anime.images?.jpg.image_url || anime.anime_image || "",
      episode:
        typeof anime.episodes !== "number" || anime.episodes === null
          ? "?"
          : anime.episodes,
    };
    const URL = process.env.REACT_APP_API_MARK;
    try {
      const response = await axios.post(URL, value, {
        headers: { authorization: `Bearer ${userTokenName}` },
        withCredentials: true,
        credentials: "same-origin",
      });
      if (response.status === 200) {
        handleModal.ChangeLibraryItem(location.pathname, value);
        showSwal(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteMark = async (e) => {
    e.preventDefault();
    const library_id = values.library_id;
    const URL = `${process.env.REACT_APP_API_BASE_URL}/mark/${library_id}`;
    try {
      const response = await axios.delete(URL);
      if (response.status === 200) {
        handleModal.deleteLibraryItem(location.pathname, anime_id, status);
        showSwal(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const showSwal = (message) => {
    withReactContent(Swal)
      .fire({
        title: message,
        confirmButtonText: `OK`,
        icon: "success",
      })
      .then((result) => {
        if (result.isConfirmed) {
          onClose();
        }
      });
  };
  return (
    anime && (
      <div className="modal" id={`anime-${anime.mal_id}`}>
        <div className="modal-card">
          <form className="modal-card-form">
            <div className="modal-card-header">
              <a className="text" href="/">
                {anime.title || anime.anime_title}
              </a>
            </div>
            <div className="modal-card-container">
              <div className="modal-card-item">
                <label className="modal-card-title text">Status</label>
                <select
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  value={status}
                >
                  {STATUS.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-card-note">
              <div className="modal-card-item">
                <label className="modal-card-title text">Note</label>
                <textarea
                  rows={6}
                  name="note"
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                  defaultValue={values.note}
                ></textarea>
              </div>
            </div>
            <div className="modal-card-footer">
              <button
                className="modal-card-action button-clear"
                onClick={handleDeleteMark}
                disabled={values.library_id === null}
              >
                Delete
              </button>
              <div className="button-group">
                <button
                  className="modal-card-action button-discard"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  Discard
                </button>
                <button
                  className="modal-card-action button-submit"
                  onClick={handleSaveMark}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
export default Modal;
