import { Breadcrumbs, Anchor } from '@mantine/core';

const items = [
  { title: 'Dashboard', href: '/' },
  { title: 'Mantine hooks', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

/**
 * Displays the breadcrumbs according to the page you are in
 * @returns {JSX.Element}
 */
function BreadcrumbsComponent() {
  return <Breadcrumbs>{items}</Breadcrumbs>;
}

export default BreadcrumbsComponent;
