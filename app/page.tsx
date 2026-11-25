"use client";
import { useEffect } from "react";
export default function HomePage(){useEffect(()=>{let active=true;import("./legacy").then(({mountLegacyApp})=>{if(active)mountLegacyApp();});return()=>{active=false;};},[]);return <div id="app"/>;}
