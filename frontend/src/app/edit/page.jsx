/**************************************************************
 *
 *                     Page.jsx
 *
 *        Authors: Massimo Bottari, Elias Swartz
 *           Date: 03/07/2025
 *
 *     Summary: imports from SettingsPage.jsx and userVerificationCard.jsx to display the settings page.
 * 
 **************************************************************/

"use client";

import React, { useState, useEffect } from "react";
import EditPage from "../components/EditPage";
import "../components/EditPage.css"


const Edit = () => {
    return (
        <div className="edit-page">
        <EditPage />
        </div>
    );
};

export default Edit;