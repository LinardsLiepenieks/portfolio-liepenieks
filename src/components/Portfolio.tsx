import ScrollContainer from '@/components/ScrollContainer';
import {
  Section1,
  Section2,
  Section3,
} from '@/components/sections/DummySections';

export default function Portfolio() {
  const routes = ['/', '/about', '/contact'];

  return (
    <ScrollContainer routes={routes}>
      <Section1 />
      <Section2 />
      <Section3 />
    </ScrollContainer>
  );
}
