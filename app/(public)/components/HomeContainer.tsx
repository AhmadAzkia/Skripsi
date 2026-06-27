"use client";

import HomeHero from "./HomeHero";
import HomeStats from "./HomeStats";
import HomeFeatures from "./HomeFeatures";
import HomeFeaturedCourses from "./HomeFeaturedCourses";
import HomeTestimonials from "./HomeTestimonials";
import { Tables } from "@/../types/database";

type PelatihanFeatured = Tables<"pelatihan">;

interface HomeContainerProps {
  featuredCourses: PelatihanFeatured[];
}

export default function HomeContainer({ featuredCourses }: HomeContainerProps) {
  return (
    <div className="min-h-screen">
      <HomeHero />
      <HomeStats />
      <HomeFeatures />
      <HomeFeaturedCourses featuredCourses={featuredCourses} />
      <HomeTestimonials />
    </div>
  );
}
