import { render } from '@react-email/render';

import MagicLinkEmail from '@/components/email/MagicLinkEmail';
import OrderItemStepEmail from '@/components/email/OrderStepItemEmail';

import type { TemplateName, Templates } from './email-types';

const renderTemplate = <T extends TemplateName>(
  template: T,
  props: Templates[T],
): Promise<string> => {
  if (template === 'magic-link') {
    return render(MagicLinkEmail({ url: props.url }));
  }

  if (template === 'order-item-step') {
    const typedProps = props as Templates['order-item-step'];
    return render(
      OrderItemStepEmail({
        orderName: typedProps.orderName,
        content: typedProps.content,
        url: typedProps.url,
      }),
    );
  }

  throw new Error(`Email template "${template}" not found`);
};

export default renderTemplate;
