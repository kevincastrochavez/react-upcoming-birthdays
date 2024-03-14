/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../componentsShadcn/ui/tabs';
import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import Share from '../../components/share/Share';
import Import from '../../components/import/Import';

const mainContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-bottom: 100px;
`;

/**
 * Displays the ShareImport component page
 * @returns {JSX.Element}
 */
function ShareImport() {
  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <Tabs defaultValue='share' className=''>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='share'>Share my List</TabsTrigger>
          <TabsTrigger value='import'>Import a List</TabsTrigger>
        </TabsList>
        <TabsContent value='share'>
          <Share />
        </TabsContent>
        <TabsContent value='import'>
          <Import />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default ShareImport;
