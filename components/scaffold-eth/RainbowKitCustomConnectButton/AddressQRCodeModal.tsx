import { QRCodeSVG } from "qrcode.react";
import { Address as AddressType } from "~~/node_modules/viem/_types";
import { Address } from "~~/components/scaffold-eth";

type AddressQRCodeModalProps = {
  address: AddressType;
  modalId: string;
};

export const AddressQRCodeModal = ({ address, modalId }: AddressQRCodeModalProps) => {
  return (
    <>
      <div>
        <input type="checkbox" id={`${modalId}`} className="modal-toggle" />
        <label htmlFor={`${modalId}`} className="modal cursor-pointer">
          <label className="modal-box relative bg-[#24262F] border border-[#FFFFFF]/10 shadow-xl p-6 max-w-sm mx-auto rounded-lg">
            {/* dummy input to capture event onclick on modal box */}
            <input className="h-0 w-0 absolute top-0 left-0" />
            <label 
              htmlFor={`${modalId}`} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1D2A] text-white hover:bg-[#FFFFFF]/10 cursor-pointer transition-colors"
            >
              ✕
            </label>
            <div className="py-6">
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG value={address} size={220} />
                </div>
                <div className="text-[#FFFFFF] text-sm break-all text-center">
                  <Address address={address} format="long" disableAddressLink onlyEnsOrAddress />
                </div>
              </div>
            </div>
          </label>
        </label>
      </div>
    </>
  );
};