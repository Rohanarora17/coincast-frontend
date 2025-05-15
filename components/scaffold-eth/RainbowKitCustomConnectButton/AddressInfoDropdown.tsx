import { useRef, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import CopyToClipboard from "react-copy-to-clipboard";
import { getAddress } from "viem";
import { Address } from "viem";
import { useDisconnect } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,  
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar, isENS } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const checkSumAddress = getAddress(address);

  const [addressCopied, setAddressCopied] = useState(false);

  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        <summary 
          tabIndex={0} 
          className="flex items-center gap-2 px-3 py-2.5 bg-[#24262F] hover:bg-[#2A2D3A] text-white rounded-lg border border-[#FFFFFF]/10 cursor-pointer touch-manipulation"
        >
          <BlockieAvatar address={checkSumAddress} size={24} ensImage={ensAvatar} />
          <span className="mx-1 text-sm">
            {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-[#FFFFFF]/70" />
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[2] p-2 mt-2 shadow-lg bg-[#1A1D2A] border border-[#FFFFFF]/10 rounded-lg w-64 sm:w-72"
        >
          <NetworkOptions hidden={!selectingNetwork} />
          <li className={selectingNetwork ? "hidden" : ""}>
            {addressCopied ? (
              <div className="flex items-center gap-3 px-4 py-3 text-[#24E8AD] rounded-lg">
                <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm whitespace-nowrap">Address copied</span>
              </div>
            ) : (
              <CopyToClipboard
                text={checkSumAddress}
                onCopy={() => {
                  setAddressCopied(true);
                  setTimeout(() => {
                    setAddressCopied(false);
                  }, 800);
                }}
              >
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFFFF]/5 text-white rounded-lg cursor-pointer touch-manipulation">
                  <DocumentDuplicateIcon className="h-5 w-5 text-[#FFFFFF]/70" aria-hidden="true" />
                  <span className="text-sm whitespace-nowrap">Copy address</span>
                </div>
              </CopyToClipboard>
            )}
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <label htmlFor="qrcode-modal" className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFFFF]/5 text-white rounded-lg cursor-pointer touch-manipulation">
              <QrCodeIcon className="h-5 w-5 text-[#FFFFFF]/70" />
              <span className="text-sm whitespace-nowrap">View QR Code</span>
            </label>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <a
              target="_blank"
              href={blockExplorerAddressLink}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFFFF]/5 text-white rounded-lg touch-manipulation"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-[#FFFFFF]/70" />
              <span className="text-sm whitespace-nowrap">View on Block Explorer</span>
            </a>
          </li>
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFFFF]/5 text-white rounded-lg w-full text-left touch-manipulation"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-5 w-5 text-[#FFFFFF]/70" /> 
                <span className="text-sm">Switch Network</span>
              </button>
            </li>
          ) : null}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFFFF]/5 text-[#FF5C6A] rounded-lg w-full text-left touch-manipulation"
              type="button"
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" /> 
              <span className="text-sm">Disconnect</span>
            </button>
          </li>
        </ul>
      </details>
    </>
  );
};