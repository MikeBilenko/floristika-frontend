import React from "react";
import Title from "ui/Title/Title";

const DeliveryReturn = () => {
  return (
    <div>
      <Title>DELIVERY & RETURNS </Title>
      {/* delivert */}
      <div>
        <h2>DELIVERY</h2>
        <p>We use fixed-price flower delivery pricing.</p>
        <div>
          <div>-Сity Center – 3.99 EUR</div>
          <div>-other districts of Riga - 5.99 EUR</div>
          <div>
            -Riga district (Marupe,Babītē,Piņķi,Salaspils,Balož, Berģi ) – 9.99
            EUR,
          </div>
          <div>-Jūrmala, Ādaži, Carnikava, Ogre - 14.99 EUR.</div>
        </div>
      </div>
      {/* ./delivert */}
      {/* returns */}
      <div>
        <p>
          We will strive to refund your items, including the original standard
          shipping cost, within 2 days of receipt. We know how important it is
          to get your money back expediently. I f you would like to receive
          store credit in the form of a gift voucher, please contact us here.
        </p>
      </div>
      <div>
        <h2>FAULTY OR DAMAGED ITEMS</h2>
        <p>
          We are very disappointed on the rare occasions our customers receive a
          faulty product. If you have identified the fault within 30 days of
          purchase, please apply for a return via our online returns portal,
          choosing the reason “damaged” from the drop down menu, followed by
          emailing us photo(s) of the damaged item(s) for our review. Once the
          return has been approved, you will receive a pre-paid shipping label
          from us via email, and this can also be downloaded from the returns
          portal.
        </p>
      </div>
      <div>
        <h2>EXCLUSIONS AND EXCEPTIONS</h2>
        <p>
          Bouquets, Any bouquet that is customised (including cutting it to a
          non-standard length fit your own vase) may be non-refundable. Please
          ensure that you do not un-tie your bouquet until you are completely
          satisfied with it as a re-arranging fee will be deducted from your
          refund.
        </p>
        <p>
          Where a bunch is returned that was sold under a “6 for the price of 5”
          offer, the refund will be for 5 stems.
        </p>
        <p>
          Multi-stem Arrangements are sold as a set and at a discount to the
          combined value of all the stems. Returns of individual stems sold as
          part of an Arrangement may be refunded at the discounted rate to a
          full price stem.
        </p>
        <p>
          A restocking fee may be imposed at our discretion for repeat returns,
          on large orders over £500 and where our flowers appear to have been
          “borrowed”. Please note to ensure the quality remains pristine for all
          customers, we do not rent out our flowers.{" "}
        </p>
      </div>
    </div>
  );
};

export default DeliveryReturn;
