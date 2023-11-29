import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideToast} from "../../../store/toast";

const Toast = () => {
    const isOpen = useSelector(state => state.toast.open);
    const message = useSelector(state => state.toast.message);
    const dispatch = useDispatch()

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                handleClose();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        dispatch(hideToast());
    };

    return (
        <div className="toast align-items-center d-block position-fixed toast-pos" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body">
                    {message}
                </div>
                <button onClick={handleClose} type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast"
                        aria-label="Close"></button>
            </div>
        </div>
    );
}

export default Toast;
