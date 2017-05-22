import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Oprations } from 'modules/operations/Home';
import { ChangeMmUpper } from 'modules/operations/ChangeMmUpper';
import { GiveTransferCoupon } from 'modules/operations/GiftTransferCoupon';
import { SendEliteScore } from 'modules/operations/SendTransferEliteScore';
import { SendEnvelopUserBudget } from 'modules/operations/SendEnvelopUserBudget';
import { GiveXiaoluCoin } from 'modules/operations/GiveXiaoluCoin';
import { CreateXiaoluMama } from 'modules/operations/CreateXiaoluMama';

export default (
  <Route path="/operations" breadcrumbName="运营操作">
    <IndexRoute component={Oprations} />
    <Route path="/operations/changemmupper" breadcrumbName="更改推荐关系" component={ChangeMmUpper} />
    <Route path="/operations/giftxiaolucoin" breadcrumbName="赠送小鹿币" component={GiveXiaoluCoin} />
    <Route path="/operations/createmama" breadcrumbName="创建小鹿妈妈" component={CreateXiaoluMama} />
    <Route path="/operations/gifttransfercoupon" breadcrumbName="赠送精品券" component={GiveTransferCoupon} />
    <Route path="/operations/sendelitescore" breadcrumbName="赠送精品积分" component={SendEliteScore} />
    <Route path="/operations/sendenvelopuserbudget" breadcrumbName="给用户钱包发送红包" component={SendEnvelopUserBudget} />
  </Route>
);
