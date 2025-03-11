"use client";

import React, { useState, useEffect, Suspense } from "react";
import EditPage from "../components/EditPage";
import "../components/EditPage.css"
import { useSearchParams } from 'next/navigation';

const EditContent = () => {
    /* useSearchParams to fetch for id */
    const searchParams = useSearchParams();
    const unitId = searchParams.get("id");

    const [unit, setUnit] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadItem() {
            console.log(unitId);
            try {
                const response = await fetch(`../../../api/db`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: 'SELECT * from dummy_data WHERE id=$1',
                        params: [unitId],
                    }),
                });
                
                if (!response.ok) {
                    if (response.status === 428) {
                        throw new Error('Item does not exist');
                    }
                    throw new Error('Failed to fetch item');
                }
                
                const itemData = await response.json();
                const [firstUnit] = itemData;
                setUnit(firstUnit);
                setError(null);
            } catch (error) {
                setError(error.message);
                setUnit(null);
            } finally {
                setLoading(false);
            }
        }

        loadItem();
    }, [unitId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!unit) return <div>No item found</div>;

    return (
        <div className="edit-page">
            <EditPage unit={unit} />
        </div>
    );
};

const Edit = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditContent />
        </Suspense>
    );
};

export default Edit;
