import * as React from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import { AnalyticsCategory, AnalyticsCategoryArgs, track } from './GoogleAnalytics';

/**
 * This button fires a tracking event when clicked
 * @param onClick event to click
 * @param category category of the event to track
 * @param action action to track
 * @param label label to track
 * @param buttonProps props for the underlying button
 */
export default function TrackedButton<TCategory extends AnalyticsCategory,
  TAction extends keyof AnalyticsCategoryArgs[TCategory] & string>({ onClick, category, action, actionLabel, ...buttonProps }: ButtonProps & {
  category: TCategory;
  action: TAction;
  actionLabel?: string;
}) {
  return (
    <Button
      {...buttonProps}
      onClick={(...args) => {
        track(category, action, actionLabel);
        onClick && onClick(...args);
      }}
    />
  );
}