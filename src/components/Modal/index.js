import './modal.css';

function Modal({anime, onClose}){
    return (
        anime &&(
            <div className='modal' id={`anime-${anime.mal_id}`}>
                <div className='modal-card'>
                    <form className='modal-card-form'>
                        <div className='modal-card-header'>
                            <a className='text' href='/'>{anime.title}</a>
                        </div>
                        <div className='modal-card-container'>
                            <div className='modal-card-item'>
                                <label className='modal-card-title text'>
                                    Status
                                </label>
                                <select>
                                    <option>
                                        Completed
                                    </option>
                                    <option>
                                        Watching
                                    </option>
                                </select>
                            </div>
                            <div className='modal-card-item'>
                                <label className='modal-card-title text'>
                                    Status
                                </label>
                                <select>
                                    <option>
                                        Completed
                                    </option>
                                    <option>
                                        Watching
                                    </option>
                                </select>
                            </div>
                            <div className='modal-card-item'>
                                <label className='modal-card-title text'>
                                    Status
                                </label>
                                <select>
                                    <option>
                                        Completed
                                    </option>
                                    <option>
                                        Watching
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className='modal-card-note'>
                        <div className='modal-card-item'>
                                <label className='modal-card-title text'>
                                    Note
                                </label>
                                <textarea rows={6}>

                                </textarea>
                            </div>
                        </div>
                        <div className='modal-card-footer'>
                            <button className='modal-card-action button-clear' disabled>
                                Delete
                            </button>
                            <div className='button-group'>
                                <button className='modal-card-action button-discard' onClick={(e) => {
                                    e.preventDefault()
                                    onClose()
                                    }}>
                                    Discard
                                </button>
                                <button className='modal-card-action button-submit'>
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    )
}
export default Modal