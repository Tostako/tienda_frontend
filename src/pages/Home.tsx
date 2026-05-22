import { Hero } from '../components/sections/Hero';
import { Benefits } from '../components/sections/Benefits';
import { Categories } from '../components/sections/Categories';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { Newsletter } from '../components/sections/Newsletter';

export function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}
