import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/appBanners/Home';
import { AppBannerPicture } from './Home/appBannersPic';
import { EditAppBannerPic } from './Edit/editPictrue';
import { BuildBanner } from './buildBanner/buildBanner';
import { BuildItem } from './Edit/buildItem';
import { ChangeBanner } from './Edit/editBanner';

export default (
  <Route path="/appbanners" breadcrumbName="海报">
    <IndexRoute component={Home} />
    <Route path="/appbanners/picture" breadcrumbName="图片详情" component={AppBannerPicture} />
    <Route path="/appbanners/picture/edit" breadcrumbName="编辑图片" component={EditAppBannerPic} />
    <Route path="/appbanners/picture/build" breadcrumbName="创建海报" component={BuildBanner} />
    <Route path="/appbanners/picture/builditem" breadcrumbName="创建海报项" component={BuildItem} />
    <Route path="/appbanners/edit" breadcrumbName="编辑海报" component={ChangeBanner} />
    appbanners/edit
  </Route>
);
