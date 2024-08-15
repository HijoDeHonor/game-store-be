export const executeQueryExampleFirstCall = [
  {
    offerId: 'bce4ed5b-70da-41dc-a651-269826f4b4fb',
    userName: 'admin'
  }
];

export const executeQueryExampleSecondCall = [
  {
    offerId: 'bce4ed5b-70da-41dc-a651-269826f4b4fb',
    offerItemName: 'espada',
    offerQuantity: 2,
    offerItemImg: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&'
  }
];

export const executeQueryExampleThirdCall = [
  {
    offerId: 'bce4ed5b-70da-41dc-a651-269826f4b4fb',
    requestItemName: 'arco',
    requestQuantity: 2,
    requestItemImg: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&'
  }
];

export const executeQueryExampleParse = {
  offers: [
    {
      Id: 'bce4ed5b-70da-41dc-a651-269826f4b4fb',
      Offer: [
        {
          Img: 'https://cdn-icons-png.freepik.com/256/11858/11858642.png?uid=R125020544&ga=GA1.1.297410512.1711637426&',
          Name: 'espada',
          Quantity: 2
        }
      ],
      Request: [
        {
          Img: 'https://cdn-icons-png.freepik.com/256/9728/9728024.png?uid=R125020544&ga=GA1.1.297410512.1711637426&',
          Name: 'arco',
          Quantity: 2
        }
      ],
      UserNamePoster: 'admin'
    }
  ],
  totalOffers: 11
};
