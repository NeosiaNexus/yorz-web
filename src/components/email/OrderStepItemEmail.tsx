import { Body, Html, Text } from '@react-email/components';

interface OrderItemStepEmailProps {
  orderName: string;
  content: string;
  url: string;
}

const OrderItemStepEmail = ({
  orderName,
  content,
  url,
}: OrderItemStepEmailProps): React.JSX.Element => {
  return (
    <Html>
      <Body>
        <Text>
          Une nouvelle mise à jour concernant votre commande ({orderName}) vient d&apos;être
          publiée.
        </Text>
        <Text>Note: {content}</Text>
        <Text>
          Cliquer sur le lien ci-dessous pour accéder à la mise à jour :{' '}
          <a href={url}>Voir la mise à jour</a>
        </Text>
      </Body>
    </Html>
  );
};

export default OrderItemStepEmail;
