import ReadyBar from '@/components/ReadyBar';
import { useState } from "react";
import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar'
import Head from "next/head";

export default function Ready() {
    return (
        <>  
            <title>Ready</title>
                <div>
                <ReadyBar />
                <SearchBar />
            </div>


        </>
    )
}