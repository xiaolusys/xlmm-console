import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Oprations } from 'modules/operations/Home';
import { ChangeMmUpper } from 'modules/operations/ChangeMmUpper';
import { GiveTransferCoupon } from 'modules/operations/GiftTransferCoupon';
import { SendEliteScore } from 'modules/operations/SendTransferEliteScore';

export default (
  <Route path="/operations" breadcrumbName="运营操作">
    <IndexRoute component={Oprations} />
    <Route path="/operations/changemmupper" breadcrumbName="更改推荐关系" component={ChangeMmUpper} />
    <Route path="/operations/gifttransfercoupon" breadcrumbName="赠送精品券" component={GiveTransferCoupon} />
    <Route path="/operations/sendelitescore" breadcrumbName="赠送精品积分" component={SendEliteScore} />
  </Route>
);
