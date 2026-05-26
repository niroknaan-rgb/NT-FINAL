import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import {
  Undo2,
  X,
  Briefcase,
  Palette,
  ChevronRight,
  ChevronLeft,
  Unlock,
  Lock,
  Book,
  Maximize2,
  Minimize2,
  Check,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type CharacterType =
  | "inspector"
  | "painter-broom"
  | "inspector-stopsign"
  | "inspector-final"
  | "chef"
  | "chef-norecipe"
  | "painter"
  | "pianist"
  | "pianist-door"
  | "pianist-happy"
  | "caretaker"
  | "caretaker-vase"
  | "caretaker-happy"
  | "caretaker-unlit-candle"
  | "clown"
  | "clown-stairs"
  | "chef-final"
  | "pianist-final"
  | "caretaker-final"
  | "painter-final"
  | "painter-broom-final"
  | null;

type Location =
  | "entrance"
  | "lounge"
  | "hallway"
  | "kitchen"
  | "music"
  | "music-storage"
  | "garage"
  | "studio"
  | "bathroom"
  | "stairs"
  | "bedroom"
  | "livingroom";

interface RoomProps {
  onInspect: (item: string) => void;
  onNavigate: (location: Location) => void;
  onPickupItem?: (item: string, e: React.MouseEvent) => void;
  hasItem?: (item: string) => boolean;
  isFusePlaced?: boolean;
  selectedItem?: string | null;
  isTvCodeVisible?: boolean;
  onUseRemote?: () => void;
  onCharacterClick?: () => void;
  isCharacterInteracting?: boolean;
  onMessage?: (msg: string, type?: "system" | "speech") => void;
  isPaintingRemoved?: boolean;
  isBathroomUnlocked?: boolean;
  characterInteractionStep?: number;
  onNextStep?: () => void;
  onCloseInventory?: () => void;
}

const PRELOAD_IMAGES = [
  "https://i.postimg.cc/7LR7CWV0/Gemini-Generated-Image-vxrym3vxrym3vxry-removebg-preview.png",
  "https://i.postimg.cc/vZ17qQyb/kd-sbwr.png",
  "https://i.postimg.cc/TYB5PgzB/nr-kbwy.png",
  "https://i.postimg.cc/0NtcD9N7/tmwnh-msphtyt.png",
  "https://i.postimg.cc/3RXRNWRP/ניר_משמרות_זהב_מדבר.png",
  "https://i.postimg.cc/3xZj9n9f/mpthwt-rkb.png",
  "https://i.postimg.cc/4yc9Wnzf/ביצים.png",
  "https://i.postimg.cc/6qjzxXhM/mhbt.png",
  "https://i.postimg.cc/8C5fZGr4/qnbs-hds.png",
  "https://i.postimg.cc/8PtNyF9k/יומן_פתוח_3.png",
  "https://i.postimg.cc/8zbdwtwZ/mql.png",
  "https://i.postimg.cc/9097LzG0/syr.png",
  "https://i.postimg.cc/9z5S7vpJ/dlyym-'l-hmdp.png",
  "https://i.postimg.cc/BQM4h8kG/יומן_פתוח_1.png",
  "https://i.postimg.cc/DwcQ5B5j/mt_t_-sbwr.png",
  "https://i.postimg.cc/Dy6GWdJ6/nyr-msmrwt-zhb-_m-mql.png",
  "https://i.postimg.cc/FRTMqdbk/pth-'m-mdrgwt.png",
  "https://i.postimg.cc/FsDNPf8N/מברג_על_הצד.png",
  "https://i.postimg.cc/FsQd9ryT/syr-lm_lh.png",
  "https://i.postimg.cc/G3QRVN1c/hwt.png",
  "https://i.postimg.cc/Gm920G8T/ניר_שף.png",
  "https://i.postimg.cc/HnvWMWfF/kppwt-nyqwy.png",
  "https://i.postimg.cc/KYz30bgQ/qnbs-hds-_m-zywr.png",
  "https://i.postimg.cc/MGTsv6w2/dly-zb_-khwl-sgwr.png",
  "https://i.postimg.cc/MK8MW67L/syr-_m-psth.png",
  "https://i.postimg.cc/MZ9kyCgd/מפתח_כסוף.png",
  "https://i.postimg.cc/MZ9kyCgs/מפתח_זהוב.png",
  "https://i.postimg.cc/NFXHdL15/פסטה.png",
  "https://i.postimg.cc/PJ0F7fbC/nyr-lyzn-mdbr.png",
  "https://i.postimg.cc/QC7TfVpd/חלב.png",
  "https://i.postimg.cc/QMC3MQCc/pns-_wltrh-sgwl.png",
  "https://i.postimg.cc/Qxm7Bk95/nyr-hnr.png",
  "https://i.postimg.cc/RZ31sMm9/kd.png",
  "https://i.postimg.cc/T2L7WNRK/ywmn.png",
  "https://i.postimg.cc/Twt6BccG/mtkwn-mqwpl.png",
  "https://i.postimg.cc/XJfJqXJz/ניר_ליצן.png",
  "https://i.postimg.cc/YCSWQGY1/nyr-psntrn-mdbr.png",
  "https://i.postimg.cc/YCSWQGY6/nyr-psntrn-mrwgs.png",
  "https://i.postimg.cc/YCSWQGYx/nyr-sp-_m-psth.png",
  "https://i.postimg.cc/ZnNdw0r0/עוף.png",
  "https://i.postimg.cc/ZqRgWwW8/mbrg-swkb.png",
  "https://i.postimg.cc/bN3p6GWz/יומן_פתוח_2.png",
  "https://i.postimg.cc/bwkLybh3/hwt-whwq.png",
  "https://i.postimg.cc/cC8QgYZW/slt.png",
  "https://i.postimg.cc/d0t2frS4/_zwr-_l-mql.png",
  "https://i.postimg.cc/fLZbNhsC/ניר_הצייר.png",
  "https://i.postimg.cc/fWYqgn2P/tmwnh-msphtyt-zd-sny.png",
  "https://i.postimg.cc/g2rJ98Xx/ניר_משמרות_זהב.png",
  "https://i.postimg.cc/h4xJxzRJ/twwym.png",
  "https://i.postimg.cc/j5H52C2r/ניר_שף_מדבר.png",
  "https://i.postimg.cc/k495mdCy/ניר_הצייר_מדבר.png",
  "https://i.postimg.cc/kXsSVF6Q/nyr-hzyyr-smh.png",
  "https://i.postimg.cc/ncKhRTsy/GRAIN.png",
  "https://i.postimg.cc/rmPMJXL0/sydh.png",
  "https://i.postimg.cc/rpF1HxYf/_zwr.png",
  "https://i.postimg.cc/rsWf67Dm/qwd-X-3.png",
  "https://i.postimg.cc/vHhn1Lgf/nyr-hnr-_m-hnr.png",
  "https://i.postimg.cc/vT90RC4Z/qwd-X-2.png",
  "https://i.postimg.cc/vTnV0DW4/שמנת.png",
  "https://i.postimg.cc/vZv7X3XP/mt_t_.png",
  "https://i.postimg.cc/wTdy6qXP/syr-_m-psth-wsmnt.png",
  "https://i.postimg.cc/wj91CGvB/swlm.png",
  "https://i.postimg.cc/wjBmDyLc/nyr-psntrn.png",
  "https://i.postimg.cc/x8H6rBXd/qwd-X-1.png",
  "https://i.postimg.cc/zBxr4kkm/mtkwn-lpsth.png",
  "https://i.postimg.cc/zDxmns4n/הוק.png",
  "https://i.postimg.cc/zX7hLSbh/nyr-hnr-mdbr.png",
  "https://media.giphy.com/media/YyKPbc5OOTSQE/giphy.gif",
];

const MobileWarningScreen = ({ onAcknowledge }: { onAcknowledge: () => void }) => {
  return (
    <div className="absolute inset-0 z-[100000] flex flex-col items-center justify-center bg-black text-white p-8 text-center" dir="rtl">
      <AlertCircle className="w-20 h-20 flex-shrink-0 text-red-500 mb-6" />
      <p className="text-2xl mb-3 font-sans">האפליקציה נועדה למשחק בטלפון</p>
      <p className="text-2xl mb-3 font-sans text-red-400">אם אתם משתמשים במחשב המשחק לא יעבוד</p>
      <p className="text-2xl mb-12 font-sans">אנא השתמשו במכשיר סלולרי</p>
      <button 
        onClick={onAcknowledge}
        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-xl font-sans shadow-[0_0_20px_rgba(255,255,255,0.3)] flex-shrink-0"
      >
        המשך למשחק
      </button>
    </div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loaded = 0;
    const total = PRELOAD_IMAGES.length;

    if (total === 0) {
      onComplete();
      return;
    }

    let isMounted = true;
    (window as any).__PRELOADED_IMAGES =
      (window as any).__PRELOADED_IMAGES || [];

    const handleLoad = () => {
      if (!isMounted) return;
      loaded++;
      setProgress(Math.round((loaded / total) * 100));

      if (loaded >= total) {
        // Small delay so user sees 100%
        setTimeout(() => {
          if (isMounted) onComplete();
        }, 400);
      }
    };

    // Preload loop
    PRELOAD_IMAGES.forEach((src) => {
      // Check if we already loaded it in a previous mount
      const alreadyLoaded = (window as any).__PRELOADED_IMAGES.find(
        (img: any) => img.src === src && img.complete,
      );
      if (alreadyLoaded) {
        handleLoad();
        return;
      }

      const img = new Image();
      img.referrerPolicy = "no-referrer";

      img.onload = handleLoad;
      img.onerror = handleLoad; // Count errors too so we don't get stuck

      img.src = src;
      (window as any).__PRELOADED_IMAGES.push(img);
    });

    // Failsafe timeout just in case something fundamentally breaks,
    // but 30 seconds should be plenty.
    const failsafe = setTimeout(() => {
      if (isMounted && loaded < total) {
        console.warn(`Preload timeout: ${loaded}/${total} images loaded.`);
        onComplete();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
    };
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 bg-[#0a0000] flex flex-col items-center justify-center text-white z-[99999]"
      dir="ltr"
    >
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://i.postimg.cc/ncKhRTsy/GRAIN.png')] opacity-40"></div>

      <div className="w-[80cqw] max-w-sm h-3 bg-[#1a0505] rounded-full overflow-hidden border-2 border-[#3a0a0a] shadow-inner z-10 relative">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8b0000] to-[#ff3333] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-[#ff3333] font-mono tracking-widest font-bold z-10 text-sm drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
        {progress}%
      </p>
    </div>
  );
};

const ITEM_NAMES: Record<string, string> = {
  screwdriver: "מברג",
  fuse: "פיוז",
  remote: "שלט",
  "recipe-book": "יומן",
  pasta: "פסטה",
  cream: "שמנת",
  milk: "חלב",
  eggs: "ביצים",
  chicken: "עוף",
  pan: "מחבת",
  "family-picture": "תמונה משפחתית",
  "bathroom-key": "מפתח זהוב",
  "silver-key": "מפתח כסוף",
  string: "חוט",
  hook: "וו",
  "hook-string": "חוט עם וו",
  ladder: "סולם",
  "folded-paper": "נייר מקופל",
  recipe: "מתכון",
  pot: "סיר",
  "ready-pasta": "פסטה בשמנת",
  "blue-paint": "צבע כחול",
  "stop-sign": "תמרור עצור",
  "car-keys": "מפתח לרכב",
  "bedroom-key": "מפתח לחדר השינה",
  gloves: "כפפות",
  vase: "אגרטל",
  candle: "נר",
  "lit-candle": "נר דולק",
  broom: "מטאטא",
  "broken-broom": "מטאטא שבור",
  stick: "מוט עץ",
  "stick-stop-sign": "תמרור עצור על מקל",
  "uv-flashlight": "פנס UV",
  "sheet-music": "תווים",
};

const OrientationLock = ({ disabled, isPortrait }: { disabled?: boolean; isPortrait: boolean }) => {
  if (disabled || !isPortrait) return null;
  return (
    <div className="fixed inset-0 z-[999999] bg-black text-white flex flex-col items-center justify-center p-8 text-center pointer-events-auto">
      <div className="w-24 h-40 border-4 border-white rounded-xl relative mb-8 animate-[spin_2s_ease-in-out_infinite]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
      </div>
      <h2 className="text-2xl font-bold mb-4 tracking-widest">
        נא לסובב את המכשיר
      </h2>
      <p className="text-gray-400">המשחק מיועד למסך אופקי בלבד.</p>
    </div>
  );
};

const Door = ({
  onClick,
  label = "יציאה",
  className = "w-[12%] h-[55%]",
  color = "#8b5a2b",
  locked = false,
  noAnimation = false,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
  color?: string;
  locked?: boolean;
  noAnimation?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (locked) {
      onClick();
      return;
    }
    if (noAnimation) {
      onClick();
      return;
    }
    setIsOpen(true);
    setTimeout(() => {
      onClick();
      setIsOpen(false);
    }, 600);
  };

  return (
    <div
      className={`${className?.includes("relative") || className?.includes("absolute") ? "" : "absolute"} perspective-[100cqw] ${className}`}
      style={{ transform: "translateZ(1px)" }}
    >
      {/* Door Frame Background (visible when open) - Placed first to render behind */}
      <div className="absolute inset-0 bg-black"></div>

      <motion.div
        animate={{ rotateY: isOpen ? -90 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full h-full border-4 border-[#5c3a21] bg-[#8b5a2b] flex flex-col items-end justify-center pr-2 cursor-pointer hover:brightness-110 origin-left shadow-xl relative"
        onClick={handleClick}
        style={{ transformStyle: "preserve-3d", backgroundColor: color }}
      >
        {/* Door Panels */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[35%] border-2 border-[#5c3a21] opacity-50"></div>
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[35%] border-2 border-[#5c3a21] opacity-50"></div>
        {/* Handle */}
        <div className="w-3 h-3 bg-[#d4af37] rounded-full shadow-md absolute right-2 top-1/2 -translate-y-1/2"></div>
        {locked && (
          <div className="w-2 h-3 bg-yellow-600 rounded-sm shadow-md absolute right-2.5 top-[calc(50%+12px)] flex items-center justify-center border border-yellow-800">
            <div className="w-0.5 h-1.5 bg-black rounded-full"></div>
          </div>
        )}

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity tracking-widest text-xs font-bold bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap"></div>
      </motion.div>
    </div>
  );
};

const ReturnButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className="absolute bottom-4 left-4 w-[50px] h-[50px] text-white/70 hover:text-white transition-colors z-[99999] bg-black/50 backdrop-blur-sm border border-white/20 rounded-full shadow-lg flex items-center justify-center pointer-events-auto"
  >
    <Undo2 size={24} />
  </button>
);

const CloseUpContainer = ({
  children,
  aspectRatio,
  onClose,
}: {
  children: React.ReactNode;
  aspectRatio: number;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-auto cursor-pointer"
      style={{ containerType: "size" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: `calc(100cqh * ${aspectRatio})`,
          maxHeight: `calc(100cqw / ${aspectRatio})`,
        }}
      >
        {children}
      </div>
      <ReturnButton
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
    </motion.div>
  );
};

const Entrance = ({
  onNavigate,
  onInspect,
  isClownTalked,
  onCharacterClick,
  isCharacterInteracting,
}: RoomProps & {
  isClownTalked: boolean;
  onCharacterClick: () => void;
  isCharacterInteracting: boolean;
}) => {
  const handleDoorClick = () => {
    if (!isClownTalked) {
      // Message handled by SpeechBubble or similar if needed, but here we just prevent navigation
      return;
    }
    onNavigate("lounge");
  };

  return (
    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />
      <Door
        onClick={handleDoorClick}
        label=""
        className="w-[20%] h-[60%]"
        color="#6b4423"
        noAnimation={!isClownTalked}
      />
      {!isClownTalked && (
        <CharacterClown
          isInteracting={isCharacterInteracting}
          onClick={onCharacterClick}
        />
      )}
    </div>
  );
};

const Lounge = ({
  onInspect,
  onNavigate,
  isPaintingRemoved,
  paintingScrews,
  selectedItem,
  onMessage,
  onCloseInventory,
  isBathroomKeyPickedUp,
  onLightCandle,
}: RoomProps & {
  isPaintingRemoved: boolean;
  paintingScrews: boolean[];
  isBathroomKeyPickedUp: boolean;
  onLightCandle?: () => void;
}) => (
  <div className="absolute inset-0 bg-[#0a0505] overflow-hidden perspective-[100cqw]">
    {/* 3D Room Container */}
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* Back Wall */}
      <div
        className="absolute top-[20%] bottom-[20%] left-[25%] right-[25%] bg-[#3a1a1a] border-4 border-[#1a0a0a] shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] flex items-end justify-center pb-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Fireplace */}
        <div
          className="w-[35%] h-[45%] border-8 border-b-0 border-[#2a0f0f] bg-[#1a0a0a] flex justify-center items-end p-4 shadow-2xl relative"
          style={{
            transform: "translateZ(1px)",
            transformStyle: "preserve-3d",
          }}
          onClick={() => {
            if (selectedItem === "candle") {
              if (onLightCandle) onLightCandle();
            }
          }}
        >
          <div
            className="absolute -top-[20%] w-[110%] h-[20%] bg-[#2a1414] border-2 border-[#1a0a0a] cursor-pointer hover:brightness-125 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onInspect("lounge-mantle");
            }}
            style={{ transform: "translateZ(1px)" }}
          ></div>
          <motion.div
            animate={{ height: ["40%", "55%", "45%"], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-1/2 bg-[#ff6b35] blur-md rounded-t-full shadow-[0_0_60px_#ff6b35] relative"
            style={{ transform: "translateZ(1px)" }}
          />
        </div>

        {/* Painting above fireplace */}
        <div
          className="absolute top-[10%] left-[37.5%] w-[25%] h-[25%] cursor-pointer hover:brightness-110 transition-all flex items-center justify-center"
          onClick={() => {
            if (isBathroomKeyPickedUp) return;
            if (selectedItem !== "ladder") {
              if (onMessage) onMessage("גבוה מידי", "system");
            } else {
              if (onCloseInventory) onCloseInventory();
              onInspect("painting");
            }
          }}
          style={{ transform: "translateZ(1px)" }}
        >
          {!isPaintingRemoved ? (
            <div className="w-full h-full bg-[url('https://i.postimg.cc/0NtcD9N7/tmwnh-msphtyt.png')] bg-contain bg-no-repeat bg-center opacity-80 relative"></div>
          ) : (
            <div className="w-full h-full bg-black/60 shadow-inner flex items-center justify-center">
              <div className="w-full h-full border-4 border-[#1a0a0a] bg-black/40"></div>
            </div>
          )}
        </div>

        {/* Bookshelf */}
        <div
          className="absolute bottom-[10%] right-[5%] w-[20%] h-[70%] border-4 border-[#2a0f0f] bg-[#1a0a0a] flex flex-col justify-evenly p-2 shadow-xl cursor-pointer hover:border-[#4a1f1f] transition-colors"
          onClick={() => onInspect("lounge-bookshelf")}
          style={{ transform: "translateZ(1px)" }}
        >
          {/* Shelf 1 */}
          <div className="w-full h-[5%] bg-[#0a0505] relative flex items-end justify-start px-1 gap-1">
            <div className="w-[15%] h-[400%] bg-[#5a3a3a] rounded-t-sm"></div>
            <div className="w-[10%] h-[300%] bg-[#3a4a5a] rounded-t-sm"></div>
          </div>
          {/* Shelf 2 */}
          <div className="w-full h-[5%] bg-[#0a0505] relative flex items-end justify-end px-1 gap-1">
            <div className="w-[20%] h-[350%] bg-[#4a3a5a] rounded-t-sm"></div>
          </div>
          {/* Shelf 3 */}
          <div className="w-full h-[5%] bg-[#0a0505] relative flex items-end justify-start px-1 gap-1">
            <div className="w-[15%] h-[300%] bg-[#4a5a3a] rounded-t-sm"></div>
            <div className="w-[15%] h-[400%] bg-[#5a3a3a] rounded-t-sm"></div>
          </div>
          {/* Shelf 4 (Bottom) */}
          <div className="w-full h-[5%] bg-[#0a0505] relative flex items-end justify-end px-1 gap-1">
            <div className="w-[20%] h-[350%] bg-[#3a4a4a] rounded-t-sm"></div>
          </div>
        </div>

        {/* Door to Hallway (Back Wall) */}
        <Door
          onClick={() => onNavigate("hallway")}
          label="למסדרון"
          className="bottom-0 left-[5%] w-[22%] h-[75%]"
          color="#5c2424"
        />
      </div>

      {/* Left Wall */}
      <div
        className="absolute top-[20%] bottom-[20%] right-[75%] w-[200%] bg-[#4a1c1c] border-y-4 border-[#1a0a0a] shadow-[inset_-100px_0_150px_rgba(0,0,0,0.8)] flex items-center justify-end"
        style={{
          transform: "rotateY(75deg)",
          transformOrigin: "right",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute bottom-0 w-full h-[30%] border-t-4 border-[#2a0f0f] bg-[#2a0f0f]/50"></div>
        <Door
          onClick={() => onNavigate("kitchen")}
          label="למטבח"
          className="bottom-0 right-[5%] w-[10%] h-[80%]"
          color="#3d5c3d"
        />
      </div>

      {/* Right Wall */}
      <div
        className="absolute top-[20%] bottom-[20%] left-[75%] w-[200%] bg-[#4a1c1c] border-y-4 border-[#1a0a0a] shadow-[inset_100px_0_150px_rgba(0,0,0,0.8)] flex items-center justify-start"
        style={{
          transform: "rotateY(-75deg)",
          transformOrigin: "left",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute bottom-0 w-full h-[30%] border-t-4 border-[#2a0f0f] bg-[#2a0f0f]/50"></div>
        <Door
          onClick={() => onNavigate("livingroom")}
          label="לסלון"
          className="bottom-0 left-[5%] w-[10%] h-[80%]"
          color="#4c245c"
        />
      </div>

      {/* Ceiling */}
      <div
        className="absolute bottom-[80%] left-[25%] right-[25%] h-[200%] bg-[#2a0f0f] border-x-4 border-[#1a0a0a] flex justify-center items-end pb-[15%] shadow-[inset_0_-100px_150px_rgba(0,0,0,0.9)]"
        style={{ transform: "rotateX(-75deg)", transformOrigin: "bottom" }}
      >
        <div className="w-[20%] h-[15%] bg-[#ffcc00]/20 rounded-full blur-xl shadow-[0_0_120px_rgba(255,200,0,0.6)]"></div>
      </div>

      {/* Floor */}
      <div
        className="absolute top-[80%] left-[25%] right-[25%] h-[200%] bg-[#1a0a0a] border-x-4 border-[#1a0a0a] flex justify-center shadow-[inset_0_100px_150px_rgba(0,0,0,0.9)]"
        style={{ transform: "rotateX(75deg)", transformOrigin: "top" }}
      >
        <div className="w-[70%] h-[80%] mt-[10%] bg-[#5c2424] border-4 border-[#3a1414] rounded-t-full shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] opacity-90 relative">
          <div className="w-full h-full border-4 border-[#8b3a3a]/30 rounded-t-full m-2"></div>

          {/* Clickable Rug Area (Entire Rug) */}
          <div
            className="absolute inset-0 cursor-pointer z-20 hover:bg-white/5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onInspect("rug-corner");
            }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

const CharacterCaretaker = ({
  isInteracting,
  onClick,
  isHappy,
}: {
  isInteracting: boolean;
  onClick: () => void;
  isHappy?: boolean;
}) => {
  return (
    <motion.div
      className={`absolute cursor-pointer group origin-bottom z-[150]`}
      initial={false}
      animate={{
        bottom: isInteracting ? "-100%" : "5%",
        left: isInteracting ? "25%" : "75%",
        x: isInteracting ? "-50%" : "-50%",
        right: "auto",
        height: isInteracting ? "200%" : "75%",
        scaleX: isInteracting ? -1 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onClick={!isInteracting ? onClick : undefined}
    >
      <img
        src={
          isHappy
            ? "https://i.postimg.cc/vHhn1Lgf/nyr-hnr-_m-hnr.png"
            : isInteracting
              ? "https://i.postimg.cc/zX7hLSbh/nyr-hnr-mdbr.png"
              : "https://i.postimg.cc/Qxm7Bk95/nyr-hnr.png"
        }
        alt="Caretaker"
        className="h-full w-auto object-contain origin-bottom drop-shadow-2xl group-hover:brightness-110 transition-all pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

const LivingRoom = ({
  onNavigate,
  isFusePlaced,
  selectedItem,
  isTvCodeVisible,
  onUseRemote,
  onCharacterClick,
  isCharacterInteracting,
  hasAgreedToHelpCaretaker,
  isCaretakerHappy,
  onPickupItem,
  hasItem,
  onVaseInteract,
  onRemoveItem,
}: RoomProps & {
  onCharacterClick: () => void;
  isCharacterInteracting: boolean;
  hasAgreedToHelpCaretaker: boolean;
  isCaretakerHappy: boolean;
  onVaseInteract?: () => void;
  onRemoveItem?: (item: string) => void;
}) => {
  const [vasePicked, setVasePicked] = useState(false);
  return (
    <div className="absolute inset-0 bg-[#3a1c4a] overflow-hidden">
      {" "}
      {/* Purple */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4c245c_0%,#1f0f2a_100%)]"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-[#2a143a] border-t-4 border-[#1a0c2a] z-0"></div>

        {/* Nightstand (Decorative) */}
        <div className="absolute bottom-[16%] left-[8%] w-[22%] h-[30%] z-20 flex items-end justify-center">
          <img
            src="https://i.postimg.cc/rmPMJXL0/sydh.png"
            className="w-[80%] h-auto object-contain pointer-events-none drop-shadow-2xl"
            alt="Nightstand"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Vase */}
        {!hasItem?.("vase") && !vasePicked && (
          <div
            className="absolute bottom-[40%] left-[12%] w-[14%] h-[23%] z-30 cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-end justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (selectedItem === "gloves") {
                onPickupItem?.("vase", e);
                onRemoveItem?.("gloves");
                setTimeout(() => setVasePicked(true), 300);
              } else {
                if (onVaseInteract) {
                  onVaseInteract();
                }
              }
            }}
          >
            <img
              src="https://i.postimg.cc/RZ31sMm9/kd.png"
              className="w-[70%] h-auto object-contain drop-shadow-xl pointer-events-none"
              alt="Vase"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Sofa */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[40%] h-[30%] flex flex-col items-center z-10">
          <div className="w-[90%] h-[60%] bg-[#5a346a] rounded-t-xl shadow-lg border-2 border-[#4a245a]"></div>
          <div className="w-full h-[40%] bg-[#6a447a] rounded-md shadow-xl border-2 border-[#5a346a] flex justify-evenly items-start pt-2">
            <div className="w-[30%] h-4 bg-[#4a245a] rounded-full opacity-50"></div>
            <div className="w-[30%] h-4 bg-[#4a245a] rounded-full opacity-50"></div>
          </div>
        </div>

        {/* TV */}
        <div
          className={`absolute top-[15%] left-1/2 -translate-x-1/2 w-[35%] h-[35%] bg-black border-4 border-[#1a1a1a] rounded-lg shadow-2xl flex items-center justify-center overflow-hidden z-10 ${isFusePlaced && selectedItem === "remote" ? "cursor-pointer hover:brightness-110" : ""}`}
          onClick={() => {
            if (isFusePlaced && selectedItem === "remote" && onUseRemote) {
              onUseRemote();
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-10 pointer-events-none"></div>
          {isFusePlaced ? (
            isTvCodeVisible ? (
              <div className="absolute inset-0 bg-blue-900 flex items-center justify-center">
                <span className="text-white font-mono text-5xl tracking-widest font-bold shadow-blue-500/50 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  6641
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="https://media.giphy.com/media/YyKPbc5OOTSQE/giphy.gif"
                  alt="TV Static"
                  className="w-full h-full object-cover opacity-80 mix-blend-screen pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            )
          ) : (
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-full h-full bg-blue-500/10 pointer-events-none"
            />
          )}
        </div>

        <CharacterCaretaker
          isInteracting={isCharacterInteracting}
          onClick={onCharacterClick}
          isHappy={isCaretakerHappy}
        />
      </div>
      <ReturnButton onClick={() => onNavigate("lounge")} />
    </div>
  );
};

const Hallway = ({
  onNavigate,
  isBathroomUnlocked,
}: RoomProps & { isBathroomUnlocked: boolean }) => (
  <div className="absolute inset-0 bg-[#0a0c0e] overflow-hidden perspective-[100cqw]">
    {/* 3D Room Container */}
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* Back Wall (Center) */}
      <div
        className="absolute top-[25%] bottom-[25%] left-[37%] right-[37%] bg-[#2c343b] border-4 border-[#15181c] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] flex flex-col items-center justify-end"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Stairs Doorway Image */}
        <div
          className="absolute bottom-0 w-[50%] h-[75%] flex flex-col items-center justify-end cursor-pointer group relative"
          onClick={() => onNavigate("stairs")}
          style={{ transform: "translateZ(1px)" }}
        >
          <img
            src="https://i.postimg.cc/FRTMqdbk/pth-'m-mdrgwt.png"
            alt="Stairs Opening"
            className="w-full h-full object-contain object-bottom opacity-90 group-hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Left Wall */}
      <div
        className="absolute top-[25%] bottom-[25%] right-[63%] w-[200%] bg-[#3a444d] border-y-4 border-[#15181c] shadow-[inset_-100px_0_150px_rgba(0,0,0,0.8)] flex items-center justify-end"
        style={{
          transform: "rotateY(75deg)",
          transformOrigin: "right",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Wall panels/wainscoting */}
        <div className="absolute bottom-0 w-full h-[40%] border-t-4 border-[#2c343b] bg-[#2c343b]/50"></div>
        <Door
          onClick={() => onNavigate("studio")}
          label="סטודיו"
          className="bottom-0 right-[4%] w-[8%] h-[75%]"
          color="#4a6b8c"
        />
        <Door
          onClick={() => onNavigate("garage")}
          label="חניה"
          className="bottom-0 right-[15%] w-[8%] h-[75%]"
          color="#8c815e"
        />
      </div>

      {/* Right Wall */}
      <div
        className="absolute top-[25%] bottom-[25%] left-[63%] w-[200%] bg-[#3a444d] border-y-4 border-[#15181c] shadow-[inset_100px_0_150px_rgba(0,0,0,0.8)] flex items-center justify-start"
        style={{
          transform: "rotateY(-75deg)",
          transformOrigin: "left",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Wall panels/wainscoting */}
        <div className="absolute bottom-0 w-full h-[40%] border-t-4 border-[#2c343b] bg-[#2c343b]/50"></div>
        <Door
          onClick={() => onNavigate("music")}
          label="מוזיקה"
          className="bottom-0 left-[4%] w-[8%] h-[75%]"
          color="#8c5e73"
        />
        <Door
          onClick={() => onNavigate("bathroom")}
          label="מקלחת"
          className="bottom-0 left-[15%] w-[8%] h-[75%]"
          color="#5e8c85"
          locked={!isBathroomUnlocked}
        />
      </div>

      {/* Ceiling */}
      <div
        className="absolute bottom-[75%] left-[37%] right-[37%] h-[200%] bg-[#15181c] border-x-4 border-[#0a0c0e] flex justify-center items-end pb-[20%] shadow-[inset_0_-100px_150px_rgba(0,0,0,0.9)]"
        style={{ transform: "rotateX(-75deg)", transformOrigin: "bottom" }}
      >
        {/* Lights */}
        <div className="w-[30%] h-[10%] bg-yellow-100/40 rounded-full blur-xl shadow-[0_0_100px_rgba(255,255,200,0.8)]"></div>
      </div>

      {/* Floor */}
      <div
        className="absolute top-[75%] left-[37%] right-[37%] h-[200%] bg-[#0f1114] border-x-4 border-[#0a0c0e] flex justify-center shadow-[inset_0_100px_150px_rgba(0,0,0,0.9)]"
        style={{ transform: "rotateX(75deg)", transformOrigin: "top" }}
      >
        {/* Floorboards texture */}
        <div className="absolute inset-0 opacity-20 flex justify-evenly">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-2 h-full bg-black"></div>
          ))}
        </div>
        {/* Carpet leading to stairs */}
        <div className="w-[60%] h-full bg-[#5c2424] opacity-80 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] border-x-4 border-[#3a1414] relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjNWMyNDI0Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjM2ExNDE0IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-30"></div>
        </div>
      </div>
    </div>

    <ReturnButton onClick={() => onNavigate("lounge")} />
  </div>
);

const StairsTransition = ({
  onNavigate,
  onInspect,
  isClownTalked,
  onCharacterClick,
  isCharacterInteracting,
  isBedroomUnlocked,
  selectedItem,
  onUnlockBedroom,
  onRemoveItem
}: RoomProps & {
  isClownTalked?: boolean;
  onCharacterClick?: () => void;
  isCharacterInteracting?: boolean;
  isBedroomUnlocked?: boolean;
  selectedItem?: string | null;
  onUnlockBedroom?: () => void;
  onRemoveItem?: (item: string) => void;
}) => {
  const [stairState, setStairState] = useState<
    "climbing_up" | "at_top" | "climbing_down"
  >("climbing_up");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (stairState === "climbing_up") {
      const timer = setTimeout(() => {
        setStairState("at_top");
      }, 2500);
      return () => clearTimeout(timer);
    } else if (stairState === "climbing_down") {
      const timer = setTimeout(() => {
        onNavigate("hallway");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stairState, onNavigate]);

  useEffect(() => {
    if (message) {
      const duration = Math.max(2000, message.length * 100);
      const timer = setTimeout(() => setMessage(null), duration);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (stairState === "at_top") {
    return (
      <div className="absolute inset-0 bg-[#15181c] flex flex-col items-center justify-end overflow-hidden">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded text-lg z-50 border border-white/20 shadow-lg"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Door */}
        <Door
          onClick={() => {
            if (isBedroomUnlocked) {
              onNavigate("bedroom");
            } else if (selectedItem === "bedroom-key") {
              if (onUnlockBedroom) onUnlockBedroom();
              if (onRemoveItem) onRemoveItem("bedroom-key");
              onNavigate("bedroom");
            } else {
              setMessage("נראה שהדלת נעולה");
            }
          }}
          label="חדר שינה"
          className="relative w-[24%] h-[75%] mb-0"
          color="#6b4423"
          locked={!isBedroomUnlocked}
        />

        {/* Clown at top of stairs */}
        {isClownTalked && onCharacterClick && (
          <CharacterClown
            isInteracting={!!isCharacterInteracting}
            onClick={onCharacterClick}
            customDialogue={["היי הצלחת"]}
            position="stairs"
          />
        )}

        {/* Last Step */}
        <div
          className="w-full h-[15%] cursor-pointer relative flex flex-col group"
          onClick={() => setStairState("climbing_down")}
        >
          {/* Step Tread (Top) */}
          <div className="w-full h-[40%] bg-[#5c6b7a] border-t border-[#7a8b9b] shadow-[inset_0_2px_5px_rgba(255,255,255,0.1)] group-hover:brightness-110 transition-all"></div>
          {/* Step Riser (Front) */}
          <div className="w-full h-[60%] bg-[#3a444d] border-b border-[#1a1c20] shadow-[0_5px_10px_rgba(0,0,0,0.5)] group-hover:brightness-110 transition-all"></div>

          {/* Down indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#15181c] flex flex-col items-center justify-end overflow-hidden perspective-[100cqw]">
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-end"
        initial={
          stairState === "climbing_down"
            ? { y: 200, opacity: 0 }
            : { y: 0, opacity: 1 }
        }
        animate={
          stairState === "climbing_up"
            ? {
                y: [0, 200],
                opacity: [1, 0],
              }
            : stairState === "climbing_down"
              ? {
                  y: [200, 0],
                  opacity: [0, 1],
                }
              : {}
        }
        transition={{ duration: 2.5, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom center" }}
      >
        {/* Stairs leading up to a door */}
        <div className="absolute inset-0 flex flex-col items-center justify-end z-10">
          {[...Array(8)].map((_, i) => {
            return (
              <div
                key={i}
                className="relative flex flex-col w-full"
                style={{
                  height: `${100 / 8}%`,
                  zIndex: 8 - i,
                }}
              >
                {/* Step Tread (Top) */}
                <div className="w-full h-[40%] bg-[#5c6b7a] border-t border-[#7a8b9b] shadow-[inset_0_2px_5px_rgba(255,255,255,0.1)]"></div>
                {/* Step Riser (Front) */}
                <div className="w-full h-[60%] bg-[#3a444d] border-b border-[#1a1c20] shadow-[0_5px_10px_rgba(0,0,0,0.5)]"></div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Walking shadow overlay for realism */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0, 0.4, 0, 0.4] }}
        transition={{ duration: 2.5, ease: "linear" }}
        className="absolute inset-0 bg-black pointer-events-none z-50 mix-blend-overlay"
      />
    </div>
  );
};

const Kitchen = ({
  onInspect,
  onNavigate,
  isCharacterInteracting,
  onCharacterClick,
  characterInteractionStep,
  onNextStep,
  isChefHappy,
}: RoomProps & {
  isCharacterInteracting: boolean;
  onCharacterClick: () => void;
  characterInteractionStep: number;
  onNextStep: () => void;
  isChefHappy: boolean;
}) => (
  <div className="absolute inset-0 bg-[#2b4a2b]">
    {" "}
    {/* Green */}
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#3d5c3d_0%,#1f3a1f_100%)]"></div>
    <div className="absolute bottom-0 w-full h-[30%] bg-[#1a2a1a] border-t-4 border-[#2b4a2b] transform perspective-[100cqw] rotate-x-60 origin-bottom flex flex-wrap opacity-60">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="w-[10%] h-[20%] border border-[#1f3a1f]"></div>
      ))}
    </div>
    {/* Cabinets */}
    <div className="absolute top-[15%] left-[25%] w-[45%] h-[15%] border-b-4 border-[#4d6b4d] bg-[#2b4a2b] flex shadow-lg">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex-1 border-r-2 border-[#1f3a1f] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
          onClick={() => onInspect(`kitchen-cabinet-${i}`)}
        >
          <div className="w-1/3 h-2 bg-[#5c7a5c] rounded-sm"></div>
        </div>
      ))}
    </div>
    {/* Fridge */}
    <div
      className="absolute bottom-[10%] left-[10%] w-[15%] h-[65%] border-4 border-[#a0aab5] bg-[#d1d5d5] z-10 flex flex-col cursor-pointer hover:brightness-110 transition-all shadow-2xl group"
      onClick={() => onInspect("fridge")}
    >
      <div className="flex-[2] border-b-4 border-[#a0aab5] flex items-center justify-end pr-2">
        <div className="w-1.5 h-12 bg-[#808e9b] rounded-sm group-hover:bg-white"></div>
      </div>
      <div className="flex-[4] flex items-center justify-end pr-2">
        <div className="w-1.5 h-20 bg-[#808e9b] rounded-sm group-hover:bg-white"></div>
      </div>
    </div>
    {/* Counter/Island */}
    <div className="absolute bottom-[10%] right-[15%] w-[40%] h-[35%] border-4 border-[#4d6b4d] bg-[#2b4a2b] z-20 flex flex-col shadow-2xl">
      <div className="w-[105%] h-6 border-2 border-[#a0aab5] -ml-[2.5%] -mt-6 bg-[#e0e5e5] flex items-end pb-1 px-4 gap-4 relative">
        <div className="w-8 h-4 bg-[#8b4a4a] rounded-b-full shadow-sm"></div>
        <div className="w-12 h-2 bg-[#b89971] shadow-sm"></div>
        {/* Stove area */}
        <div
          className="absolute top-0 left-[2%] w-[40%] h-full bg-black/20 cursor-pointer hover:bg-black/30 transition-colors flex items-center justify-center gap-2"
          onClick={() => onInspect("stove")}
        >
          <div className="w-3 h-3 rounded-full bg-black/40 border border-white/10"></div>
          <div className="w-3 h-3 rounded-full bg-black/40 border border-white/10"></div>
        </div>
      </div>
      <div className="flex-1 flex justify-evenly items-center relative">
        <div className="w-2 h-full bg-[#1f3a1f]"></div>
        <div
          className="absolute right-[10%] top-[15%] w-[25%] h-[30%] border-2 border-[#4d6b4d] bg-[#3d5c3d] cursor-pointer hover:brightness-125 transition-all flex items-center justify-center shadow-inner"
          onClick={() => onInspect("kitchen-drawer")}
        >
          <div className="w-1/3 h-1.5 bg-[#5c7a5c] rounded-sm"></div>
        </div>
      </div>
    </div>
    {isCharacterInteracting && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[75] pointer-events-auto"
        onClick={onNextStep}
      />
    )}
    <CharacterChef
      isInteracting={isCharacterInteracting}
      onClick={onCharacterClick}
      isHappy={isChefHappy}
    />
    <ReturnButton onClick={() => onNavigate("lounge")} />
  </div>
);

const MusicRoom = ({
  onInspect,
  onNavigate,
  onCharacterClick,
  isCharacterInteracting,
  hasAgreedToHelpPianist,
  isPianistHappy,
  onMessage,
}: Omit<RoomProps, "onCharacterClick"> & {
  onCharacterClick: (type?: string) => void;
  isCharacterInteracting: boolean;
  hasAgreedToHelpPianist: boolean;
  isPianistHappy: boolean;
  onMessage: (msg: string) => void;
}) => (
  <div className="absolute inset-0 bg-[#0a0508] overflow-hidden perspective-[100cqw]">
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* Back Wall */}
      <div
        className="absolute top-[20%] bottom-[20%] left-[25%] right-[25%] bg-[#2a1a24] border-4 border-[#1a0f16] shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] flex items-end justify-center pb-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Piano (Reverted to original 2D style) */}
        <div
          className="w-[60%] h-[60%] border-4 border-[#1a1a1a] bg-[#0a0a0a] flex flex-col justify-end shadow-2xl relative cursor-pointer hover:brightness-110 transition-all group"
          onClick={() => onInspect("piano")}
          style={{ transform: "translateZ(1px)" }}
        >
          <div className="w-full h-[20%] border-b-4 border-[#1a1a1a] bg-[#111]"></div>
          <div className="w-[60%] h-[25%] border-2 border-[#222] mx-auto mt-2 bg-[#1a1a1a] flex flex-col items-center justify-center p-2">
            <div className="w-full h-full bg-white/90 rounded-sm shadow-inner flex flex-col gap-1 p-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-0.5 bg-black/50"></div>
              ))}
            </div>
          </div>
          <div className="w-[105%] h-4 bg-[#111] border-y-2 border-[#222] -ml-[2.5%] mt-auto"></div>
          <div className="w-full h-[15%] border-b-4 border-[#1a1a1a] flex bg-white relative px-1">
            {[...Array(28)].map((_, i) => (
              <div
                key={`w-${i}`}
                className="flex-1 border-r border-gray-300"
              ></div>
            ))}
            <div className="absolute top-0 left-1 w-[calc(100%-8px)] h-[60%] flex pointer-events-none">
              {[...Array(28)].map((_, i) => {
                const isBlackKey = i % 7 !== 2 && i % 7 !== 6 && i !== 27;
                return (
                  <div key={`b-${i}`} className="flex-1 relative">
                    {isBlackKey && (
                      <div className="absolute top-0 left-[60%] w-[80%] h-full bg-black rounded-b-sm shadow-sm"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full h-[15%] flex justify-center items-end pb-2 gap-6 bg-[#0a0a0a]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-6 bg-[#d4af37] rounded-b-md shadow-sm"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Left Wall */}
      <div
        className="absolute top-[20%] bottom-[20%] right-[75%] w-[200%] bg-[#3a2430] border-y-4 border-[#1a0f16] shadow-[inset_-100px_0_150px_rgba(0,0,0,0.8)] flex items-center justify-end"
        style={{
          transform: "rotateY(75deg)",
          transformOrigin: "right",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute bottom-0 w-full h-[30%] border-t-4 border-[#1a0f16] bg-[#1a0f16]/50"></div>
      </div>

      {/* Right Wall */}
      <div
        className="absolute top-[20%] bottom-[20%] left-[75%] w-[200%] bg-[#3a2430] border-y-4 border-[#1a0f16] shadow-[inset_100px_0_150px_rgba(0,0,0,0.8)] flex items-center justify-start"
        style={{
          transform: "rotateY(-75deg)",
          transformOrigin: "left",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute bottom-0 w-full h-[30%] border-t-4 border-[#1a0f16] bg-[#1a0f16]/50"></div>
        <Door
          onClick={() => {
            if (isPianistHappy) onNavigate("music-storage");
            else onCharacterClick("pianist-door");
          }}
          label="מחסן"
          className="bottom-0 left-[8%] w-[9%] h-[80%]"
          color="#5d4037"
          noAnimation={!isPianistHappy}
        />
      </div>

      {/* Ceiling */}
      <div
        className="absolute bottom-[80%] left-[25%] right-[25%] h-[200%] bg-[#1a0f16] border-x-4 border-[#1a0f16] flex justify-center items-end pb-[15%] shadow-[inset_0_-100px_150px_rgba(0,0,0,0.9)]"
        style={{ transform: "rotateX(-75deg)", transformOrigin: "bottom" }}
      >
        <div className="w-[20%] h-[15%] bg-[#ffcc00]/10 rounded-full blur-xl shadow-[0_0_120px_rgba(255,200,0,0.4)]"></div>
      </div>

      {/* Floor */}
      <div
        className="absolute top-[80%] left-[25%] right-[25%] h-[200%] bg-[#0a0508] border-x-4 border-[#1a0f16] flex justify-center shadow-[inset_0_100px_150px_rgba(0,0,0,0.9)]"
        style={{ transform: "rotateX(75deg)", transformOrigin: "top" }}
      >
        <div className="absolute inset-0 opacity-40 flex justify-evenly">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-2 h-full bg-[#1a0f16]"></div>
          ))}
        </div>
      </div>
    </div>

    <CharacterPianist
      isInteracting={isCharacterInteracting}
      onClick={onCharacterClick}
      hasAgreed={hasAgreedToHelpPianist}
      isHappy={isPianistHappy}
    />
    <ReturnButton onClick={() => onNavigate("hallway")} />
  </div>
);

const MusicStorage = ({
  onInspect,
  onNavigate,
  onPickupItem,
  hasItem,
  isLightOn,
}: RoomProps & { isLightOn?: boolean }) => {
  const [potPickedUp, setPotPickedUp] = useState(false);
  const [broomPickedUp, setBroomPickedUp] = useState(false);

  return (
    <div
      className={`absolute inset-0 ${isLightOn ? "bg-[#1a1a0f]" : "bg-[#0a0a0a]"} overflow-hidden perspective-[100cqw] transition-colors duration-1000`}
    >
      {/* 3D Room Container without opacity transition to prevent perspective flattening glitch */}
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Back Wall */}
        <div
          className="absolute top-[10%] bottom-[10%] left-[35%] right-[35%] bg-[#222] border-4 border-[#111] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-4 gap-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cramped Shelves */}
          <div className="w-[90%] h-[70%] border-4 border-[#111] bg-[#1a1a1a] flex flex-col justify-evenly relative">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full h-2 bg-[#0a0a0a] shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
              ></div>
            ))}

            {/* Pot on the shelf */}
            {isLightOn && !hasItem?.("pot") && !potPickedUp && (
              <div
                className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[16cqw] h-[16cqw] cursor-pointer hover:brightness-125 transition-all z-50 flex items-center justify-center transform hover:scale-110 active:scale-95 duration-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickupItem?.("pot", e);
                  setTimeout(() => setPotPickedUp(true), 300);
                }}
              >
                <img
                  src="https://i.postimg.cc/9097LzG0/syr.png"
                  className="w-full h-full object-contain filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]"
                  alt="Pot"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Left Wall */}
        <div
          className="absolute top-[10%] bottom-[10%] right-[65%] w-[200%] bg-[#333] border-y-4 border-[#111] shadow-[inset_-100px_0_150px_rgba(0,0,0,0.8)] flex flex-col justify-center items-end pr-8"
          style={{
            transform: "rotateY(75deg)",
            transformOrigin: "right",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Electrical Box on Left Wall - 3D Design (Consistent size/pos, Lighter Gray) */}
          <div
            className={`absolute top-[20%] right-[32cqw] w-[14cqw] h-[20cqw] ${!isLightOn ? "cursor-pointer group hover:brightness-110 transition-all" : ""}`}
            onClick={() => {
              if (!isLightOn) onInspect("switches-box");
            }}
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(15px)",
            }}
          >
            {/* 3D Sides for depth perception */}
            <div
              className="absolute top-0 bottom-0 -left-[1.5cqw] w-[1.5cqw] bg-[#75818c]"
              style={{ transform: "rotateY(-90deg)", transformOrigin: "right" }}
            ></div>
            <div
              className="absolute -top-[1.5cqw] left-0 right-0 h-[1.5cqw] bg-[#616b75]"
              style={{ transform: "rotateX(90deg)", transformOrigin: "bottom" }}
            ></div>

            {/* Main Body (Front) */}
            <div className="absolute inset-0 bg-[#8c9ba8] border-[0.3cqw] border-[#5a6570] shadow-xl flex items-center justify-center z-20">
              <div className="absolute inset-1 border-[0.1cqw] border-white/20 opacity-30 shadow-inner"></div>
              {/* Door Handle Detail */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-[40%] bg-black/60 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-black/80 transition-colors">
                <div className="w-[1px] h-1/2 bg-white/40 rounded-full"></div>
              </div>
            </div>

            {/* Wall Shadow */}
            <div className="absolute inset-x-[-1cqw] inset-y-[-1cqw] bg-black/90 blur-[15px] -z-10 translate-x-2 translate-y-2"></div>
          </div>

          <div className="w-[30%] h-[80%] border-4 border-[#111] bg-[#1a1a1a] flex flex-col justify-evenly shadow-inner mr-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-2 bg-[#0a0a0a] opacity-80"></div>
            ))}
          </div>
        </div>

        {/* Right Wall */}
        <div
          className="absolute top-[10%] bottom-[10%] left-[65%] w-[200%] bg-[#333] border-y-4 border-[#111] shadow-[inset_100px_0_150px_rgba(0,0,0,0.8)] flex items-end p-8"
          style={{
            transform: "rotateY(-75deg)",
            transformOrigin: "left",
            transformStyle: "preserve-3d",
          }}
        ></div>

        {/* Ceiling */}
        <div
          className="absolute bottom-[90%] left-[35%] right-[35%] h-[200%] bg-[#111] border-x-4 border-[#111] shadow-[inset_0_-100px_150px_rgba(0,0,0,0.9)]"
          style={{ transform: "rotateX(-75deg)", transformOrigin: "bottom" }}
        >
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[15%] h-[15%] bg-yellow-100/10 rounded-full blur-xl shadow-[0_0_30px_rgba(255,255,200,0.2)]"></div>
        </div>

        {/* Floor */}
        <div
          className="absolute top-[90%] left-[35%] right-[35%] h-[200%] bg-[#050505] border-x-4 border-[#111] shadow-[inset_0_100px_150px_rgba(0,0,0,0.9)] flex justify-center"
          style={{ transform: "rotateX(75deg)", transformOrigin: "top" }}
        >
          <div className="absolute inset-0 opacity-20 flex justify-evenly">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-full bg-[#111]"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Broom - Overlay on top in 2D to guarantee it is NEVER hidden */}
      {isLightOn && !hasItem?.("broom") && !broomPickedUp && (
        <div
          className="absolute left-[58%] w-[18cqw] h-[67.5cqw] cursor-pointer hover:brightness-125 transition-all z-[999] transform hover:scale-105 active:scale-95 duration-100 origin-bottom flex items-end rotate-6"
          style={{ top: "calc(45% - 22.5cqw)" }}
          onClick={(e) => {
            e.stopPropagation();
            onPickupItem?.("broom", e);
            setTimeout(() => setBroomPickedUp(true), 300);
          }}
        >
          <img
            src="https://i.postimg.cc/vZv7X3XP/mt_t_.png"
            className="w-full h-full object-contain filter drop-shadow-[5px_5px_15px_rgba(0,0,0,0.8)]"
            alt="Broom"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Darkness Overlay - Animates smoothly without breaking 3D context */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ease-in-out z-[900]"
        style={{ opacity: isLightOn ? 0 : 0.65 }}
      />

      <ReturnButton onClick={() => onNavigate("music")} />
    </div>
  );
};

const TypewriterText = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const CharacterInspector = ({
  isInteracting,
  onClick,
  isHappy,
}: {
  isInteracting: boolean;
  onClick: () => void;
  isHappy?: boolean;
}) => {
  return (
    <motion.div
      className={`absolute group origin-bottom z-[80] pointer-events-none`}
      initial={false}
      animate={{
        bottom: isInteracting ? "-100%" : "2%",
        left: isInteracting ? "25%" : "5%",
        x: isInteracting ? "-50%" : "0%",
        right: "auto",
        height: isInteracting ? "200%" : "75%",
        scaleX: isInteracting ? -1 : (isHappy ? 1 : -1),
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <img
        src={
          isHappy
            ? "https://i.postimg.cc/Dy6GWdJ6/nyr-msmrwt-zhb-_m-mql.png"
            : isInteracting
              ? "https://i.postimg.cc/3RXRNWRP/ניר_משמרות_זהב_מדבר.png"
              : "https://i.postimg.cc/g2rJ98Xx/ניר_משמרות_זהב.png"
        }
        alt="Inspector"
        className="h-full w-auto object-contain origin-bottom drop-shadow-2xl group-hover:brightness-110 transition-all pointer-events-none"
        referrerPolicy="no-referrer"
      />
      {!isInteracting && (
        <div
          className="absolute top-[10%] left-[25%] w-[50%] h-[80%] cursor-pointer z-10 pointer-events-auto"
          onClick={onClick}
        />
      )}
    </motion.div>
  );
};

const CharacterChef = ({
  isInteracting,
  onClick,
  isHappy,
}: {
  isInteracting: boolean;
  onClick: () => void;
  isHappy?: boolean;
}) => {
  let chefImg = isInteracting
    ? "https://i.postimg.cc/j5H52C2r/ניר_שף_מדבר.png"
    : "https://i.postimg.cc/Gm920G8T/ניר_שף.png";
  if (isHappy) chefImg = "https://i.postimg.cc/YCSWQGYx/nyr-sp-_m-psth.png";

  return (
    <motion.div
      className={`absolute group origin-bottom z-[80]`}
      initial={false}
      animate={{
        bottom: isInteracting ? "-100%" : "1%",
        left: isInteracting ? "25%" : "18%",
        x: isInteracting ? "-50%" : "0%",
        right: "auto",
        height: isInteracting ? "200%" : "75%",
        scaleX: isInteracting ? -1 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <img
        src={chefImg}
        alt="Chef"
        className="h-full w-auto object-contain origin-bottom drop-shadow-2xl group-hover:brightness-110 transition-all pointer-events-none"
        referrerPolicy="no-referrer"
      />
      {!isInteracting && (
        <div
          className="absolute top-[10%] left-[25%] w-[50%] h-[80%] cursor-pointer z-10"
          onClick={onClick}
        />
      )}
    </motion.div>
  );
};

const CharacterPainter = ({
  isInteracting,
  onClick,
  isHappy,
}: {
  isInteracting: boolean;
  onClick: () => void;
  isHappy?: boolean;
}) => {
  let painterImg = isInteracting
    ? "https://i.postimg.cc/k495mdCy/ניר_הצייר_מדבר.png"
    : "https://i.postimg.cc/fLZbNhsC/ניר_הצייר.png";
  if (isHappy) painterImg = "https://i.postimg.cc/kXsSVF6Q/nyr-hzyyr-smh.png";

  return (
    <motion.div
      className={`absolute cursor-pointer group origin-bottom z-[110]`}
      initial={false}
      animate={{
        bottom: isInteracting ? "-100%" : "1%",
        left: isInteracting ? "25%" : "25%",
        x: isInteracting ? "-50%" : "0%",
        right: "auto",
        height: isInteracting ? "200%" : "75%",
        scaleX: -1,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onClick={!isInteracting ? onClick : undefined}
    >
      <img
        src={painterImg}
        alt="Painter"
        className="h-full w-auto object-contain origin-bottom drop-shadow-2xl group-hover:brightness-110 transition-all pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

const CharacterPianist = ({
  isInteracting,
  onClick,
  hasAgreed,
  isHappy,
}: {
  isInteracting: boolean;
  onClick: () => void;
  hasAgreed: boolean;
  isHappy?: boolean;
}) => {
  return (
    <motion.div
      className={`absolute cursor-pointer group origin-bottom z-[150]`}
      initial={false}
      animate={{
        bottom: isInteracting ? "-100%" : "1%",
        left: isInteracting ? "25%" : "60%",
        x: isInteracting ? "-50%" : "0%",
        right: "auto",
        height: isInteracting ? "200%" : "75%",
        scaleX: isInteracting ? -1 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onClick={!isInteracting ? onClick : undefined}
    >
      <img
        src={
          isHappy
            ? "https://i.postimg.cc/YCSWQGY6/nyr-psntrn-mrwgs.png"
            : isInteracting
              ? "https://i.postimg.cc/YCSWQGY1/nyr-psntrn-mdbr.png"
              : "https://i.postimg.cc/wjBmDyLc/nyr-psntrn.png"
        }
        alt="Pianist"
        className="h-full w-auto object-contain origin-bottom drop-shadow-2xl group-hover:brightness-110 transition-all pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

const CharacterClown = ({
  isInteracting,
  onClick,
  customDialogue,
  position = "entrance",
}: {
  isInteracting: boolean;
  onClick: () => void;
  customDialogue?: string[];
  position?: "entrance" | "stairs";
}) => {
  return (
    <motion.div
      className={`absolute cursor-pointer group origin-bottom z-[80]`}
      initial={false}
      animate={{
        bottom: isInteracting ? "-100%" : position === "stairs" ? "5%" : "1%",
        left: isInteracting ? "25%" : position === "stairs" ? "65%" : "60%",
        x: isInteracting ? "-50%" : "0%",
        right: "auto",
        height: isInteracting ? "200%" : "75%",
        scaleX: isInteracting ? -1 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onClick={!isInteracting ? onClick : undefined}
    >
      <img
        src={
          isInteracting
            ? "https://i.postimg.cc/PJ0F7fbC/nyr-lyzn-mdbr.png"
            : "https://i.postimg.cc/XJfJqXJz/ניר_ליצן.png"
        }
        alt="Clown"
        className="h-full w-auto object-contain origin-bottom drop-shadow-2xl group-hover:brightness-110 transition-all pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

const CharacterInteractionOverlay = ({
  step,
  choice,
  onNext,
  onChoice,
  onClose,
  characterType,
  hasAgreedToHelpInspector,
  hasAgreedToHelpChef,
  hasAgreedToHelpPainter,
  hasAgreedToHelpPianist,
  hasAgreedToHelpCaretaker,
  inventoryItems,
  isChefHappy,
  isPainterHappy,
  isBedroomUnlocked,
}: {
  step: number;
  choice: number | null;
  onNext: () => void;
  onChoice: (choice: number) => void;
  onClose: () => void;
  characterType: CharacterType;
  hasAgreedToHelpInspector: boolean;
  hasAgreedToHelpChef: boolean;
  hasAgreedToHelpPainter: boolean;
  hasAgreedToHelpPianist: boolean;
  hasAgreedToHelpCaretaker: boolean;
  inventoryItems: string[];
  isChefHappy: boolean;
  isPainterHappy: boolean;
  isBedroomUnlocked: boolean;
}) => {
  let dialogues: string[] = [];
  let showChoices = false;
  let choiceLabels = ["בטח! אנסה למצוא לך אותו", "לא נראה לי שאני אעזור"];

  const isPastaReady = inventoryItems.includes("ready-pasta");

  if (characterType === "inspector") {
    dialogues = hasAgreedToHelpInspector
      ? ["", "כבר מצאתם את התמרור שלי?"]
      : [
          "",
          "אני לא יכול לצאת למשמרות הזהב בלי התמרור שלי",
          "אם תחזירו לי את התמרור שלי\nאני אומר לכם מה שאני יודע על הרצח",
          "", // Step 3: Choices appear here, no text
          choice === 1
            ? "תודה! מקווה שזה יהיה מהר.. אני צריך לצאת"
            : "אז למה אתם כאן אם לא לעזור?!",
        ];
    showChoices = !hasAgreedToHelpInspector && step === 3 && choice === null;
    choiceLabels = ["בטח! ננסה למצוא לך אותו", "לא נראה לנו שנעזור"];
  } else if (characterType === "painter-broom") {
    dialogues = [
      "",
      "מעניין אף פעם לא חשבתי להשתמש בזה כמברשת...",
      "אהבתי את הרעיון!",
      "אבל אני צריך רק את החצי הזה",
    ];
  } else if (characterType === "inspector-final") {
    dialogues = [
      "",
      "הייתי עסוק עם המכונית, עבדתי עליו לקראת חצות",
      "הייתי מתחתיו כששמעתי מישהו נכנס לחניה",
      "חשבתי שמישהו בא לשאול אותי משהו. לא ענו, יצאו. לא ייחסתי חשיבות.",
      "אחר כך שמעתי את כל המהומה מהסלון ויצאתי.\nואז הנר מצא את ניר ו... טוב.",
      "כשחזרתי אחר כך לחניה ראיתי כתם על הרצפה. צבע כחול.\nאני מכיר צבע של אמן. ויש רק צייר אחד בבית הזה.",
    ];
  } else if (characterType === "inspector-stopsign") {
    dialogues = [
      "",
      "תודה לכם!",
      "עכשיו אוכל סוף סוף לצאת למשמרת שלי",
      "רק שתדעו שמסתתר בבית כתב סתרים...",
      "אפשר למצוא אותו רק בעזרת פנס מיוחד",
      "מזל שהוא אצלי!",
    ];
  } else if (characterType === "chef") {
    if (isChefHappy && !(choice === 1 && step >= 2)) {
      dialogues = [
        "",
        "אבל אני מבקש שבפעם הבאה תהיו קצת יותר... הגיינים",
      ];
    } else if (isPastaReady || (isChefHappy && choice === 1 && step >= 2)) {
      if (choice === 2) {
        dialogues = [
          "",
          "הבאתם לי את הפסטה שלי?",
          "", // Choice
          "אז תחזרו כשתביאו אותה!",
        ];
      } else {
        dialogues = [
          "",
          "הבאתם לי את הפסטה שלי?",
          "", // Choice
          "תודה רבה שעזרתם לי כאן במטבח!",
          "אבל אני מבקש שבפעם הבאה תהיו קצת יותר... הגיינים",
        ];
      }
      showChoices = step === 2 && choice === null;
      choiceLabels = ["כן, קח", "לא הבאנו כלום"];
    } else {
      dialogues = hasAgreedToHelpChef
        ? ["", "כבר מצאתם את הסיר שלי?"]
        : [
            "",
            "אין לי זמן לבזבז יש לי הרבה לבשל",
            "הייתי אומר לכם כל מה שאני יודע על הרצח",
            "אבל אחד מהם לקח לי את הסיר!",
            "אם תעזרו לי לבשל אספר לכם הכל",
            "", // Step 5: Choices
            choice === 1 ? "" : "אם הם יהיו רעבים.. ניר לא היחידי שירצח פה..",
          ];
      showChoices = !hasAgreedToHelpChef && step === 5 && choice === null;
      choiceLabels = ["כן שף!", "יש לנו דברים יותר חשובים לעשות.."];
    }
  } else if (characterType === "chef-norecipe") {
    dialogues = ["", "מה אתם מבשלים בלי מתכון?!"];
  } else if (characterType === "painter") {
    if (isPainterHappy) {
      dialogues = [
        "",
        "כבר מצאתם מברשת?",
      ];
      showChoices = false;
    } else if (step >= 6) {
      dialogues = [
        "",
        "",
        "",
        "",
        "",
        "", // Padding to reach step 6
        "וואו! דלי צבע כחול! תודה לכם!", // step 6
        "עכשיו רק חסרה לי מברשת", // step 7
        "אני צריך משהו גדול", // step 8
        "אם תביאו לי אספר לכם על כל מה שאני יודע מהלילה של הרצח", // step 9
      ];
      showChoices = false;
    } else {
      dialogues = hasAgreedToHelpPainter
        ? [
            "",
            "מצאתם כבר את הצבע שלי? אני צריך כחול! מהר! לפני שבורח לי הרעיון!",
          ]
        : [
            "",
            "נגמר לי הצבע הכחול וכשהלכתי לקחת עוד..",
            "ראיתי שמישהו פה גנב לי את הצבע הכחול!",
            "עכשיו איך אני אמור לצבוע הכל בכחול?!",
            "", // Step 4: Choices
            choice === 1
              ? "תודה לכם! בינתיים אנסה לקרוא למוזה שלי"
              : "זה לא כמוני לעשות את זה...",
          ];
      showChoices = !hasAgreedToHelpPainter && step === 4 && choice === null;
      choiceLabels = [
        "אנחנו נמצא לך עוד צבע!",
        "פשוט תשתמש בירוק וכתום ואדום וצהוב או סגול",
      ];
    }
  } else if (characterType === "pianist") {
    dialogues = hasAgreedToHelpPianist
      ? ["", "לה לה לה.. מצאתם את התווים שלי? עוד שניה יש לי את זה..\nלה לה לה.. אוף איך זה הלך?"]
      : [
          "",
          "הא? אוי לא שמתי לב אליכם",
          "אני לא מצליח להתרכז.. ",
          "יש מנגינה שמתנגנת לי בראש ואני לא זוכר איך היא הולכת",
          "כי מישהו פה גנב לי את התווים!",
          "אם תחזירו לי אותם אולי אצליח להתרכז במה קרה בשעת הרצח",
          "אוף זה משגע אותי!", // Step 6
          "", // Step 7: Choices
          choice === 1
            ? "יופי! אני בנתיים אנסה להיזכר בעצמי"
            : "אני לא יכול! זה היה ממש טוב!",
          choice === 1 ? "" : "עכשיו איך זה הלך... לה לה? לא זה לא זה!",
        ];
    showChoices = !hasAgreedToHelpPianist && step === 7 && choice === null;
    choiceLabels = ["נחזיר לך את המוזה!", "פשוט תמציא משהו אחר"];
  } else if (characterType === "pianist-door") {
    dialogues = hasAgreedToHelpPianist
      ? [
          "",
          "אני מצטער, אבל לפני שאתם מסתובבים במחסן מאחורה...\nאני אצטרך שתעזרו לי במשהו קודם",
        ]
      : [
          "",
          "אני מצטער, אבל לפני שאתם מסתובבים במחסן מאחורה...\nאני אצטרך שתעזרו לי במשהו קודם",
          "אני לא מצליח להתרכז.. ",
          "יש מנגינה שמתנגנת לי בראש ואני לא זוכר איך היא הולכת",
          "כי מישהו פה גנב לי את התווים!",
          "אם תחזירו לי אותם אולי אצליח להתרכז במה קרה בשעת הרצח",
          "אוף זה משגע אותי!", // Step 6
          "", // Step 7: Choices
          choice === 1
            ? "יופי! אני בנתיים אנסה להיזכר בעצמי"
            : "אני לא יכול! זה היה ממש טוב!",
          choice === 1 ? "" : "עכשיו איך זה הלך... לה לה? לא זה לא זה!",
        ];
    showChoices = !hasAgreedToHelpPianist && step === 7 && choice === null;
    choiceLabels = ["נחזיר לך את המוזה!", "פשוט תמציא משהו אחר"];
  } else if (characterType === "pianist-happy") {
    dialogues = [
      "",
      "וואו.. איזו יצירה...",
      "זאת היצירה שחיפשתי!",
      "אם אתם צריכים משהו, אתם מוזמנים לחפש במחסן פה מאחורה",
    ];
    showChoices = false;
  } else if (characterType === "caretaker") {
    dialogues = hasAgreedToHelpCaretaker
      ? ["", "כבר מצאתם לי את הנר? ממש חשוך לי פה לאחרונה"]
      : [
          "",
          "עצוב כאן מאז שניר לא פה..",
          "ויותר עצוב לי בלי הנר שלי!",
          "ניר הביא לי את הנר הזה.. תמיד הוא היה מלא באהבה",
          "אחד מהאחרים גנב לי אותו! אני בטוח!",
          "הם תמיד קינאו בקשר שלי ושל ניר",
          "אם תמצאו לי את הנר אני ממש אשמח לסייע לכם קצת",
          "", // Step 7: Choices
          choice === 1
            ? "תודה! ידעתי שתסכימו!"
            : "אז תסדרו בעצמכם! אני לא צריך טובות",
        ];
    showChoices = !hasAgreedToHelpCaretaker && step === 7 && choice === null;
    choiceLabels = [
      "אל תדאג, נביא לך נר!",
      "תמצא אותו בעצמך!",
    ];
  } else if (characterType === "caretaker-vase") {
    dialogues = ["", "אני לא אוהב שנוגעים באגרטל הזה בידיים חשופות!"];
  } else if (characterType === "caretaker-happy") {
    dialogues = [
      "",
      "תודה רבה",
      "חיפשתי את זה בכל מקום",
      "אה זה היה פה באגרטל כל הזמן הזה?",
    ];
  } else if (characterType === "caretaker-unlit-candle") {
    dialogues = ["", "מה יש לי לעשות עם נר כבוי?"];
  } else if (characterType === "clown") {
    dialogues = [
      "",
      "טוב שבאתם!",
      "התרחש רצח בתוך הבית והכל פה בכאוס",
      "אני רק הגעתי וגיליתי שניר נרצח!",
      "תעזרו לי לגלות עוד על הרצח שקרה פה ולגלות מי הרוצח",
      "תדברו עם כולם ותנסו להבין כל מה שאתם יכולים",
      "אחרי שתדברו עם כולם תפגשו אותי במעלה המדרגות",
    ];
  } else if (characterType === "clown-stairs") {
    dialogues = isBedroomUnlocked
      ? [
          "",
          "אתם יכולים להיכנס לחדר שינה עכשיו!",
          "תחקרו את החדר ונבין אחת ולתמיד מה קרה",
        ]
      : inventoryItems.includes("bedroom-key")
        ? [
            "",
            "אני רואה שיש לכם את המפתח",
            "בואו ניכנס ונראה מה קורה פה",
          ]
        : [
            "",
            "חדר השינה נעול..",
            "לאחד מהם יש את המפתח לחדר שינה",
            "החדר שבו שהתרחש הרצח",
            "תמצאו אותו ואז נבין אחת ולתמיד מה קרה",
          ];
  } else if (characterType === "chef-final") {
    dialogues = [
      "",
      "שמעתי את הנר צועק ועזבתי את המטבח.\nמה הייתי אמור לעשות? להמשיך לבשל?",
      "הגעתי לסלון, ניר לא היה שם. חשבתי שהוא בחדר שלו.",
      "ואז הנר הלך לקרוא לו ו... טוב, אתם יודעים מה הוא מצא.",
      "אבל תשמעו הכל באירוע נשמע לי חשוד",
      "הנר צעק חזק מדי. כאילו רצה שכולם יגיעו לסלון.\nשאף אחד לא יסתכל לכיוון של החדר של ניר.",
      "אבל אני לא יודע. אתם הבלשים...",
    ];
  } else if (characterType === "pianist-final") {
    dialogues = [
      "",
      "ניגנתי כמה שעות, הייתי עייף, ורציתי מים.",
      "הלכתי למטבח, שתיתי, וכשחזרתי",
      "התווים שלי נעלמו!",
      "חיפשתי בכל החדר. עכשיו אתם שואלים אותי על ניר..",
      "כן, שמעתי. נורא. אבל אם אתם שואלים אותי.. זה השף",
      "הוא אמר שהוא היה במטבח בדיוק כשאני הייתי שם",
      "אבל הוא לא היה..",
    ];
  } else if (characterType === "caretaker-final") {
    dialogues = [
      "",
      "ישבתי בסלון, ראיתי טלוויזיה. הכל רגיל. ואז - שחור.",
      "הטלוויזיה כבתה לגמרי. צעקתי, כן.",
      "השף הגיע ואחריו הצייר",
      "מישהו עשה את זה בכוונה.",
      "התיבה של הפיוזים בחניה והפקח היה שם כל הערב.\nאומר לי שלא ראה כלום",
      "איך!? וכשבדקנו הפיוז לא היה שם!",
      "הלכתי לקרוא לניר לספר לו מה קרה,\nו... מצאתי אותו על הרצפה. לא זז.",
      "צבע אדום בכל מקום. לא אשכח את זה.",
      "קראתי לכולם לבוא לראות והסכמנו שצריך לקרוא למישהו\nאז קראנו לליצן..",
      "נעלנו את החדר וחיכינו עד שתגיעו",
      "הנה המפתח לחדר השינה במעלה המדרגות..\nאתם מוזמנים ללכת לראות בעצמכם..",
    ];
  } else if (characterType === "painter-final" || characterType === "painter-broom-final") {
    dialogues = [
      "",
      "עבדתי בסטודיו כל הערב. הפסנתרן ניגן ברקע, רגיל לחלוטין. ",
      "ואז שתיקה פתאומית, באמצע המוזיקה. לא סיים, פשוט הפסיק.",
      "ואז פתאום צעקה מהסלון, יצאתי לראות מה קרה,\nכשהגעתי לסלון השף והנר כבר היו שם.",
      "היה עניין עם הטלוויזיה,\nנשארתי כמה דקות ואז חזרתי לסטודיו",
      "כשחזרתי הצבע הכחול שלי נעלם!",
      "אחר כך שמענו שניר... מצאו אותו ככה.\nאני לא אגיד מה אני חושב.",
      "אני רק אגיד שהפסנתרן הפסיק בלי סיבה,\nוהוא נותן תירוצים נורא מוזרים...",
    ];
  }

  return (
    <div
      className="absolute inset-0 z-[1000] flex flex-col items-center p-8 pointer-events-auto cursor-pointer"
      onClick={!showChoices ? onNext : undefined}
    >
      <div className="absolute bottom-4 left-4 z-[1100]">
        <ReturnButton
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </div>
      {/* Bottom Speech Box - Aligned Left */}
      {!showChoices && dialogues[step] && (
        <div className="fixed bottom-0 left-0 w-full z-[1010]">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={step}
            className="w-full bg-black/90 backdrop-blur-xl border-t-4 border-yellow-500 p-8 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-white text-lg md:text-xl text-right font-bold tracking-wide leading-relaxed whitespace-pre-line">
                <TypewriterText text={dialogues[step]} />
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {showChoices && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto z-[1020]">
          <button
            className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all text-lg shadow-xl"
            onClick={() => onChoice(1)}
          >
            {choiceLabels[0]}
          </button>
          <button
            className="px-8 py-4 bg-black/80 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg shadow-xl"
            onClick={() => onChoice(2)}
          >
            {choiceLabels[1]}
          </button>
        </div>
      )}
    </div>
  );
};

const Garage = ({
  onInspect,
  onNavigate,
  isCharacterInteracting,
  onCharacterClick,
  characterInteractionStep,
  onNextStep,
  onPickupItem,
  hasItem,
  isCarOn,
  selectedItem,
  onMessage,
  isInspectorHappy,
  isCarUnlocked,
}: RoomProps & {
  isCharacterInteracting: boolean;
  onCharacterClick: () => void;
  characterInteractionStep: number;
  onNextStep: () => void;
  isCarOn?: boolean;
  selectedItem: string | null;
  onMessage: (msg: string) => void;
  isInspectorHappy?: boolean;
  isCarUnlocked?: boolean;
}) => (
  <div className="absolute inset-0 bg-[#4a4a2b]">
    {" "}
    {/* Yellow/Khaki */}
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#5c5c3d_0%,#2a2a1a_100%)]"></div>
    <div className="absolute bottom-0 w-full h-[30%] bg-[#2a2a1a] border-t-4 border-[#3a3a24] transform perspective-[100cqw] rotate-x-60 origin-bottom"></div>
    {/* Ladder leaning on back wall */}
    {!hasItem?.("ladder") && (
      <div
        className="absolute bottom-[30%] left-[55%] h-[45%] z-10 cursor-pointer"
        onClick={(e) => onPickupItem?.("ladder", e)}
      >
        <img
          src="https://i.postimg.cc/wj91CGvB/swlm.png"
          alt="Ladder"
          className="h-full w-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          referrerPolicy="no-referrer"
        />
      </div>
    )}
    {/* Garage Door */}
    <div className="absolute top-[10%] left-[10%] w-[40%] h-[60%] border-8 border-[#3a3a24] bg-[#4a4a2b] flex flex-col justify-evenly opacity-80 shadow-inner">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-full h-2 bg-[#2a2a1a] border-y border-[#3a3a24]/50"
        ></div>
      ))}
    </div>
    {/* Fuse Box */}
    <div
      className="absolute top-[30%] right-[15%] w-[10%] h-[25%] border-4 border-[#5c6b7a] bg-[#2c343b] z-10 cursor-pointer hover:brightness-125 transition-all flex items-center justify-center group shadow-xl"
      onClick={() => onInspect("fuse-box")}
    >
      <div className="w-1/2 h-full border-r-2 border-[#1a1c20] opacity-50"></div>
      <div className="absolute right-2 w-1.5 h-6 bg-[#ff4a4a] rounded-sm group-hover:bg-[#ff6b6b]"></div>
    </div>
    {/* Car */}
    <div
      className="absolute bottom-[10%] right-[15%] w-[60%] aspect-[2.5/1] flex flex-col justify-end z-30 cursor-pointer hover:brightness-110 transition-all group"
      onClick={() => {
        if (selectedItem === "car-keys" || isCarUnlocked) {
          onInspect("car-interior");
        } else {
          onMessage("נראה שהרכב נעול");
        }
      }}
    >
      {/* Car Body - Sleek Sports Car */}
      <div
        className="w-full h-[55%] bg-gradient-to-r from-[#1a4a6b] to-[#0f2a3d] relative shadow-2xl border-t-[0.4cqw] border-l-[0.4cqw] border-white/10"
        style={{
          borderTopLeftRadius: "12cqw",
          borderBottomLeftRadius: "2cqw",
          borderBottomRightRadius: "4cqw",
          borderTopRightRadius: "15cqw",
        }}
      >
        {/* Roof/Windows */}
        <div
          className="absolute bottom-full left-[25%] w-[45%] h-[70%] bg-[#0a1520] border-t-[0.4cqw] border-r-[0.4cqw] border-white/10 flex items-end overflow-hidden"
          style={{ borderTopLeftRadius: "8cqw", borderTopRightRadius: "15cqw" }}
        >
          {/* Window divider */}
          <div className="w-[1.5cqw] h-[120%] bg-[#1a4a6b] ml-[40%] transform -skew-x-[20deg] origin-bottom"></div>
        </div>

        {/* Headlight (Seamlessly integrated into front curve) */}
        <div
          className={`absolute top-0 right-0 w-[12%] h-[40%] bg-gradient-to-bl ${isCarOn ? "from-white/90 via-[#e2e8f0] to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)] border-white/80" : "from-white/30 via-[#a0aec0]/50 to-transparent shadow-none border-white/30"} border-t-[0.4cqw] border-r-[0.4cqw] transition-all duration-700`}
          style={{
            borderTopRightRadius: "15cqw",
            borderBottomLeftRadius: "10cqw",
          }}
        ></div>

        {/* Taillight (Seamlessly integrated into back curve) */}
        <div
          className={`absolute top-0 left-0 w-[8%] h-[50%] bg-gradient-to-br ${isCarOn ? "from-red-500 via-red-700 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.6)] border-red-400" : "from-red-900/60 via-red-950/40 to-transparent shadow-none border-red-800/40"} border-t-[0.4cqw] border-l-[0.4cqw] transition-all duration-700`}
          style={{
            borderTopLeftRadius: "12cqw",
            borderBottomRightRadius: "8cqw",
          }}
        ></div>

        {/* Door line */}
        <div className="absolute bottom-[20%] left-[35%] w-[25%] h-[0.5cqw] bg-black/30 rounded-full"></div>

        {/* Trunk Hit Area */}
        <button
          className="absolute top-0 -left-[1.5%] w-[31%] h-full z-40 flex items-center justify-center transition-colors cursor-pointer outline-none focus:outline-none"
          style={{
            borderTopLeftRadius: "12cqw",
            borderBottomLeftRadius: "2cqw",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (selectedItem === "car-keys" || isCarUnlocked || isCarOn) {
              onInspect("car-trunk");
            } else {
              onMessage("נראה שתא המטען נעול");
            }
          }}
          title="תא מטען"
        ></button>
      </div>
      {/* Wheels (Shrunk slightly) */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between px-[10%] translate-y-[30%] z-20 pointer-events-none">
        {/* Back Wheel */}
        <div className="w-[24%] aspect-square bg-[#101215] border-[0.8cqw] border-[#2a2d34] rounded-full flex items-center justify-center shadow-[0_1cqw_2cqw_rgba(0,0,0,0.8)] relative pointer-events-none">
          <div className="w-[50%] h-[50%] border-[0.6cqw] border-[#4a5560] rounded-full flex items-center justify-center">
            <div className="w-[40%] h-[40%] bg-[#a0aab5] rounded-full"></div>
          </div>
        </div>
        {/* Front Wheel */}
        <div className="w-[24%] aspect-square bg-[#101215] border-[0.8cqw] border-[#2a2d34] rounded-full flex items-center justify-center shadow-[0_1cqw_2cqw_rgba(0,0,0,0.8)] relative pointer-events-none">
          <div className="w-[50%] h-[50%] border-[0.6cqw] border-[#4a5560] rounded-full flex items-center justify-center">
            <div className="w-[40%] h-[40%] bg-[#a0aab5] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    {isCharacterInteracting && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[75] pointer-events-none"
      />
    )}
    <CharacterInspector
      isInteracting={isCharacterInteracting}
      onClick={onCharacterClick}
      isHappy={isInspectorHappy}
    />
    <ReturnButton onClick={() => onNavigate("hallway")} />
  </div>
);

const ArtStudio = ({
  onInspect,
  onNavigate,
  onPickupItem,
  hasItem,
  isCharacterInteracting,
  onCharacterClick,
  characterInteractionStep,
  onNextStep,
  isPainterHappy,
}: RoomProps & {
  isCharacterInteracting: boolean;
  onCharacterClick: () => void;
  characterInteractionStep: number;
  onNextStep: () => void;
  isPainterHappy?: boolean;
}) => (
  <div className="absolute inset-0 bg-[#1a1a1a] overflow-hidden perspective-[100cqw]">
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* Back Wall - Large Windows */}
      <div className="absolute top-[10%] bottom-[20%] left-[20%] right-[20%] bg-[#2a2a2a] border-4 border-[#111] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center gap-8">
        <div className="w-[30%] h-[70%] bg-sky-900/30 border-4 border-[#444] shadow-inner flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-sky-400/20 to-transparent"></div>
        </div>
        <div className="w-[30%] h-[70%] bg-sky-900/30 border-4 border-[#444] shadow-inner flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-sky-400/20 to-transparent"></div>
        </div>
      </div>

      {/* Left Wall */}
      <div
        className="absolute top-[10%] bottom-[20%] right-[80%] w-[200%] bg-[#222] border-y-4 border-[#111] shadow-[inset_-50px_0_50px_rgba(0,0,0,0.5)]"
        style={{ transform: "rotateY(80deg)", transformOrigin: "right" }}
      >
        {/* Paint Shelf */}
        <div
          className="absolute top-[35%] right-[10cqw] w-[20cqw] h-[3.5cqw] bg-[#333] border-[0.3cqw] border-[#444] cursor-pointer group flex items-end justify-around px-[1cqw] pb-[0.4cqw] shadow-[0_1.5cqw_3cqw_rgba(0,0,0,0.6)] z-[120]"
          onClick={() => onInspect("paint-shelf")}
          style={{ transform: "rotateY(-45deg)", transformOrigin: "right" }}
        >
          {/* Cans on shelf in room view - doubled size and better visibility */}
          <div className="w-[3cqw] h-[85%] bg-green-700/90 rounded-t-[0.4cqw] border-[0.15cqw] border-black/40 shadow-sm"></div>
          <div className="w-[3cqw] h-[90%] bg-yellow-600/90 rounded-t-[0.4cqw] border-[0.15cqw] border-black/40 shadow-sm"></div>
          <div className="w-[3cqw] h-[80%] bg-blue-700/90 rounded-t-[0.4cqw] border-[0.15cqw] border-black/40 shadow-sm"></div>
          <div className="w-[3cqw] h-[20%] bg-gray-600/90 rounded-sm mb-1 opacity-50"></div>
        </div>

        {/* Ladder */}
        <div className="absolute bottom-0 right-[60%] w-24 h-[80%] flex gap-8">
          <div className="w-3 h-full bg-[#3e2723] border-x border-[#1a0a0a]"></div>
          <div className="w-3 h-full bg-[#3e2723] border-x border-[#1a0a0a]"></div>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-2 bg-[#3e2723] border-y border-[#1a0a0a]"
              style={{ bottom: `${15 + i * 15}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Right Wall */}
      <div
        className="absolute top-[10%] bottom-[20%] left-[80%] w-[200%] bg-[#222] border-y-4 border-[#111] shadow-[inset_50px_0_50px_rgba(0,0,0,0.5)]"
        style={{ transform: "rotateY(-80deg)", transformOrigin: "left" }}
      >
        {/* Small Box */}
        <div
          className="absolute bottom-[10%] left-[5%] w-16 h-12 bg-[#3e2723] border-2 border-[#1a0a0a] rounded-sm shadow-xl cursor-pointer hover:brightness-125 transition-all flex items-center justify-center"
          onClick={() => onInspect("studio-box")}
        >
          <div className="w-2 h-3 bg-gray-400 rounded-sm"></div>
        </div>
      </div>

      {/* Ceiling */}
      <div
        className="absolute bottom-[90%] left-[20%] right-[20%] h-[200%] bg-[#1a1a1a] border-x-4 border-[#111] shadow-[inset_0_-50px_50px_rgba(0,0,0,0.5)]"
        style={{ transform: "rotateX(-80deg)", transformOrigin: "bottom" }}
      >
        {/* Track Lights */}
        <div className="absolute top-[20%] left-[10%] w-[80%] h-[5%] bg-[#333] flex justify-evenly items-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-8 bg-yellow-100/50 rounded-b-full shadow-[0_0_20px_rgba(255,255,200,0.5)]"
            ></div>
          ))}
        </div>
      </div>

      {/* Floor */}
      <div
        className="absolute top-[80%] left-[20%] right-[20%] h-[200%] bg-[#111] border-x-4 border-[#111] shadow-[inset_0_50px_50px_rgba(0,0,0,0.5)]"
        style={{ transform: "rotateX(80deg)", transformOrigin: "top" }}
      />
    </div>

    {/* Painter */}
    <CharacterPainter
      isInteracting={isCharacterInteracting}
      onClick={onCharacterClick}
      isHappy={
        isPainterHappy ||
        (isCharacterInteracting && characterInteractionStep >= 6)
      }
    />

    {/* Easel (Center) - Moved outside 3D context to ensure it's always on top */}
    <div
      className="absolute bottom-[10%] left-[45%] w-[28%] h-[65%] flex items-end justify-center cursor-pointer group z-50 origin-bottom scale-x-[-1]"
      onClick={() => onInspect("canvas")}
    >
      <img
        src="https://i.postimg.cc/8C5fZGr4/qnbs-hds.png"
        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform origin-bottom"
        alt="Canvas"
        referrerPolicy="no-referrer"
      />
    </div>

    <ReturnButton onClick={() => onNavigate("hallway")} />
  </div>
);

const Bathroom = ({ onNavigate, onInspect }: RoomProps) => (
  <div className="absolute inset-0 bg-[#2b4a4a]">
    {" "}
    {/* Turquoise */}
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#3d5c5c_0%,#1a2a2a_100%)]"></div>
    <div className="absolute bottom-0 w-full h-[30%] bg-[#1a2a2a] border-t-4 border-[#2b4a4a] transform perspective-[100cqw] rotate-x-60 origin-bottom flex flex-wrap opacity-60">
      {[...Array(100)].map((_, i) => {
        const isWhite = (Math.floor(i / 10) + (i % 10)) % 2 === 0;
        return (
          <div
            key={i}
            className={`w-[10%] h-[10%] ${isWhite ? "bg-[#d2dae2]" : "bg-[#2b4a4a]"}`}
          ></div>
        );
      })}
    </div>
    {/* Mirror & Sink */}
    <div className="absolute top-[20%] left-[10%] w-[25%] h-[50%] flex flex-col items-center z-10">
      <div
        onClick={() => onInspect("bathroom-mirror")}
        className="w-[80%] h-[50%] border-4 border-[#808e9b] bg-[#d2dae2] rounded-t-full relative overflow-hidden shadow-[0_0_30px_rgba(210,218,226,0.2)] cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transform -rotate-45"></div>
      </div>
      <div className="w-full h-[20%] border-4 border-[#808e9b] bg-white rounded-b-3xl mt-4 shadow-xl relative flex justify-center">
        <div className="absolute top-0 w-4 h-6 bg-[#d2dae2] rounded-b-sm"></div>
      </div>
      <div className="w-[90%] flex-1 border-x-4 border-b-4 border-[#808e9b] bg-[#485460] flex">
        <div className="flex-1 border-r-2 border-[#1e272e] flex items-center justify-center">
          <div className="w-2 h-8 bg-[#d2dae2] rounded-sm"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-2 h-8 bg-[#d2dae2] rounded-sm"></div>
        </div>
      </div>
    </div>
    {/* Shower/Tub */}
    <div
      className="absolute bottom-0 right-[15%] w-[35%] h-[80%] border-4 border-[#808e9b] bg-[#d2dae2]/10 flex flex-col justify-end relative cursor-pointer hover:brightness-110 transition-all group"
      onClick={() => onInspect("shower-drain")}
    >
      <div className="absolute top-0 left-0 w-full h-4 bg-[#808e9b]"></div>
      <div className="absolute top-4 left-0 w-[60%] h-full bg-white/20 backdrop-blur-sm border-r-2 border-white/40 pointer-events-none"></div>
      <div className="w-full h-[25%] bg-white border-t-4 border-[#808e9b] rounded-t-xl shadow-inner relative"></div>
    </div>
    <ReturnButton onClick={() => onNavigate("hallway")} />
  </div>
);

const Bedroom = ({ onNavigate, onInspect }: RoomProps) => (
  <div className="absolute inset-0 bg-[#3a1a1a] overflow-hidden">
    {/* Room Container */}
    <div className="absolute inset-0">
      {/* Back Wall (slightly textured) */}
      <div className="absolute inset-x-0 top-0 h-[80%] bg-[linear-gradient(to_bottom,#4a1c1c_0%,#2a0a0a_100%)]"></div>
      
      {/* Floor */}
      <div className="absolute bottom-0 w-full h-[30%] bg-[#1a0f0f] border-t-[0.5cqw] border-[#0a0505] z-0 shadow-inner">
        {/* Floor Wood Texture/Planks */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_48%,#0a0505_49%,#0a0505_51%,transparent_52%)] bg-[length:10cqw_100%] opacity-20"></div>
        
        {/* Blood Stains & Chalk Outline flat on floor */}
        <div className="absolute top-[22%] left-[10%] w-[35%] h-[60%] z-10 pointer-events-none transform -rotate-[25deg]">
          {/* Blood splatters */}
          <div className="absolute top-[35%] left-[25%] w-[50%] h-[30%] bg-[#700000] rounded-[40%] filter blur-[2cqw] opacity-80"></div>
          <div className="absolute top-[15%] left-[45%] w-[25%] h-[40%] bg-[#500000] rounded-full filter blur-[1px] opacity-90"></div>
          <div className="absolute top-[5%] left-[35%] w-[10%] h-[15%] bg-[#800000] rounded-full filter blur-[1px] opacity-80"></div>
          <div className="absolute top-[45%] left-[15%] w-[10%] h-[12%] bg-[#900000] rounded-full filter blur-[1px] opacity-70"></div>
          
          {/* Chalk Outline */}
          <div className="absolute inset-0 opacity-80 flex items-center justify-center">
            <img src="https://i.postimg.cc/hj6jgJnF/Gemini-Generated-Image-m4hrkkm4hrkkm4hr-removebg-preview.png" alt="Chalk Outline" className="w-[80%] h-auto object-contain transform rotate-[30deg] opacity-70" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      {/* Open Window (Left Side) */}
      <div className="absolute top-[12%] left-[12%] w-[24%] h-[42%] z-30">
        {/* Window Hole / Background - the night sky */}
        <div className="absolute inset-0 bg-[#050515] border-[0.5cqw] border-[#1a1a1a] shadow-[inset_0_0_4cqw_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Moon */}
          <div className="absolute top-[10%] right-[15%] w-[15%] aspect-square bg-[#fffae6] rounded-full opacity-90 shadow-[0_0_2cqw_rgba(255,250,230,0.6)]"></div>
          {/* Stars */}
          <div className="absolute top-[20%] left-[50%] w-[0.5cqw] h-[0.5cqw] bg-white rounded-full opacity-80"></div>
          <div className="absolute top-[40%] left-[30%] w-[0.4cqw] h-[0.4cqw] bg-white rounded-full opacity-60"></div>
          <div className="absolute top-[80%] left-[80%] w-[0.6cqw] h-[0.6cqw] bg-white rounded-full opacity-90"></div>
          
          {/* Window Frame Inner */}
          <div className="absolute inset-x-0 top-1/2 h-[0.5cqw] bg-[#0a0a0a]"></div>
          <div className="absolute inset-y-0 left-1/2 w-[0.5cqw] bg-[#0a0a0a]"></div>
        </div>
        
        {/* Window Sash (Open outwards) - Simplified transform for mobile rendering */}
        <div className="absolute inset-0 bg-[#ffffff10] border-[0.8cqw] border-[#181818] origin-left z-10 transform -skew-y-3 scale-x-[0.95]" 
             style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}>
            {/* Glass reflections */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_50%,rgba(255,255,255,0.05)_100%)] pointer-events-none"></div>
        </div>

        {/* Curtains waving (Left) */}
        <motion.div 
          animate={{ 
            skewX: [2, 8, 4, 10, 2],
            scaleX: [1, 1.05, 1, 1.08, 1],
            scaleY: [1, 0.98, 0.99, 0.96, 1]
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          className="absolute top-[-5%] left-[-15%] w-[48%] h-[115%] bg-white/60 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-b-2xl origin-top z-20 border-r border-[#ffffff20]"
        ></motion.div>
        
        {/* Curtains waving (Right) */}
        <motion.div 
          animate={{ 
            skewX: [8, 25, 15, 30, 8], 
            scaleX: [1, 1.4, 1.2, 1.5, 1],
            scaleY: [1, 0.9, 0.95, 0.85, 1]
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          className="absolute top-[-5%] right-[-15%] w-[48%] h-[115%] bg-white/60 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-b-2xl origin-top z-20 border-l border-[#ffffff20]"
        ></motion.div>
      </div>

      {/* Bed Base & Legs */}
      <div className="absolute bottom-[16%] right-[15%] w-[40%] h-[40%] z-20">
        
        {/* Bed Legs */}
        {/* Front Left Leg */}
        <div className="absolute bottom-[-10%] right-[85%] w-[5%] h-[20%] bg-[#1a1410] border-[0.2cqw] border-[#0a0502] rounded-[0.2cqw] shadow-[rgba(0,0,0,0.8)_2cqw_2cqw_3cqw]"></div>
        {/* Front Right Leg */}
        <div className="absolute bottom-[-10%] right-[5%] w-[5%] h-[20%] bg-[#1a1410] border-[0.2cqw] border-[#0a0502] rounded-[0.2cqw] shadow-[rgba(0,0,0,0.8)_2cqw_2cqw_3cqw]"></div>

        {/* Bed frame side rail showing under mattress */}
        <div className="absolute bottom-[5%] w-full h-[15%] bg-[#2a1f14] border-[0.4cqw] border-[#1a1410] rounded-md shadow-2xl"></div>

        {/* Headboard */}
        <div className="absolute top-0 w-[95%] left-1/2 -translate-x-1/2 h-[60%] border-[0.5cqw] border-[#1a1005] bg-[#2a1f14] rounded-t-[1.5cqw] shadow-xl flex items-end justify-center z-0">
           <div className="w-[85%] h-[85%] border-t-[0.4cqw] border-x-[0.4cqw] border-[#1a1410] bg-[#1a1005] rounded-t-lg"></div>
        </div>

        {/* Mattress Container */}
        <div className="absolute bottom-[13%] w-[96%] left-[2%] h-[50%] border-[0.5cqw] border-[#2b2b36] bg-[#e0e0e8] rounded-t-[1.5cqw] shadow-xl flex flex-col justify-end overflow-hidden z-10">
          {/* Pillows */}
          <div className="absolute top-[5%] w-[80%] flex justify-evenly left-1/2 -translate-x-1/2">
            <div className="w-[45%] aspect-[2/1] bg-white rounded-[0.8cqw] shadow-[0_1cqw_1.5cqw_rgba(0,0,0,0.3)] border-[0.2cqw] border-[#d0d0d8] relative mt-[2%]">
              {/* Blood stain on left pillow */}
              <div className="absolute top-[10%] right-[10%] w-[60%] h-[70%] bg-[#8b0000] rounded-[40%] opacity-80 filter blur-[0.2cqw]"></div>
            </div>
            <div className="w-[45%] aspect-[2/1] bg-white rounded-[0.8cqw] shadow-[0_1cqw_1.5cqw_rgba(0,0,0,0.3)] border-[0.2cqw] border-[#d0d0d8] mt-[2%]"></div>
          </div>
          
          <div className="absolute bottom-0 w-full h-[60%] bg-[#5c5c70] border-t-[0.5cqw] border-[#3b3b4a]">
            {/* Blanket texture */}
            <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] bg-[length:2cqw_2cqw]"></div>
          </div>
          
          {/* Blood stain on the bed sheets */}
          <div className="absolute top-[40%] left-[20%] w-[40%] h-[35%] bg-[#7a0000] rounded-[40%] opacity-90 filter blur-[0.4cqw] transform -rotate-12 z-10"></div>
          <div className="absolute top-[55%] left-[10%] w-[30%] h-[20%] bg-[#5a0000] rounded-[40%] opacity-[0.85] filter blur-[0.2cqw] z-10"></div>
          
          {/* Paper or item on bed */}
          <div 
            className="absolute top-[35%] left-[55%] w-[15%] aspect-[3/4] bg-[#f0f0f0] shadow-xl flex flex-col items-center justify-center p-[2%] z-20 border-[0.2cqw] border-[#ccc] cursor-pointer hover:scale-105 transition-transform"
            style={{ transform: "perspective(50cqw) rotateX(45deg) rotateZ(12deg)" }}
            onClick={() => onInspect("bedroom-letter")}
          >
             <div className="w-[80%] h-[0.2cqw] bg-black opacity-30 my-[5%]"></div>
             <div className="w-[80%] h-[0.2cqw] bg-black opacity-30 my-[5%]"></div>
             <div className="w-[60%] h-[0.2cqw] bg-black opacity-30 my-[5%] self-start ml-[10%]"></div>
          </div>
        </div>
      </div>
      
      {/* Right Nightstand - enlarged and visually aligned to the floor */}
      <div className="absolute bottom-[16%] right-[3%] w-[10%] h-[24%] z-20 text-[1.2cqw]">
        {/* Legs for nightstand */}
        <div className="absolute bottom-[-15%] right-[80%] w-[10%] h-[20%] bg-[#1a1410] border-[0.2cqw] border-[#0a0502]"></div>
        <div className="absolute bottom-[-15%] right-[10%] w-[10%] h-[20%] bg-[#1a1410] border-[0.2cqw] border-[#0a0502]"></div>

        <div className="absolute bottom-0 w-full h-[80%] border-[0.4cqw] border-[#3d2f24] bg-[#2a1f14] shadow-[rgba(0,0,0,0.8)_0_2cqw_5cqw] flex flex-col">
          <div className="flex-1 border-b-[0.2cqw] border-[#1a1410] flex items-center justify-center">
            <div className="w-[40%] h-[15%] bg-[#b89971] rounded-[0.2cqw] shadow-sm"></div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[40%] h-[15%] bg-[#b89971] rounded-[0.2cqw] shadow-sm"></div>
          </div>
        </div>
        {/* Lamp */}
        <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 w-[60%] h-[80%] flex flex-col items-center justify-end z-[5]">
          <div className="w-[90%] h-[60%] bg-[#fffae6] rounded-t-[0.4cqw] shadow-[0_0_15px_rgba(255,250,230,0.5)] z-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.8)_100%)]"></div>
          </div>
          <div className="w-[15%] h-[30%] bg-[#b89971] shadow-inner border-x-[0.2cqw] border-[#8a7254]"></div>
          <div className="w-[50%] h-[10%] bg-[#8a7254] rounded-t-[0.2cqw]"></div>
        </div>
      </div>
    </div>

    <ReturnButton onClick={() => onNavigate("stairs")} />
  </div>
);

// --- Inspection Views ---

const KitchenCabinet = ({
  onClose,
  index,
  selectedItem,
  onPickupItem,
  hasItem,
  screws,
  onScrewClick,
  isBoxUnlocked,
  onUnlockBox,
}: {
  onClose: () => void;
  index: number;
  selectedItem: string | null;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  screws: boolean[];
  onScrewClick: (i: number) => void;
  isBoxUnlocked?: boolean;
  onUnlockBox?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickedUp, setPickedUp] = useState(false);
  const [pickedItems, setPickedItems] = useState<string[]>([]);
  const [isLidFalling, setIsLidFalling] = useState(false);

  const handlePick = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPickupItem(item, e);
    setTimeout(() => setPickedItems((prev) => [...prev, item]), 300);
  };

  const handleBoxClick = () => {
    if (screws.every((s) => !s) && !isBoxUnlocked && !isLidFalling) {
      setIsLidFalling(true);
    }
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={3 / 2}>
      <div className="w-full h-full relative">
        <div className="absolute inset-0 border-8 border-[#4d6b4d] bg-[#1f3a1f] flex flex-col items-center justify-center p-8">
          {/* Internal Shelves */}
          {index !== 0 && (
            <div className="absolute inset-0 flex flex-col justify-evenly px-4 pointer-events-none">
              <div className="w-full h-2 bg-[#2b4a2b] border-b border-[#1a2a1a]"></div>
              <div className="w-full h-2 bg-[#2b4a2b] border-b border-[#1a2a1a]"></div>
            </div>
          )}

          {index === 0 && isOpen && (
            <div className="relative w-full h-[95%] flex items-center justify-center z-10">
              {/* Wooden or Metal Locked Box Container - Perfect Square & Larger */}
              <div 
                onClick={handleBoxClick}
                className={`relative h-[95%] aspect-square rounded-lg border-4 border-[#3c2a1a] shadow-2xl flex items-center justify-center transition-all overflow-hidden ${
                  (isBoxUnlocked || isLidFalling) ? "bg-[#5c4033] border-[#422e1b]" : "bg-[#2b1f15] cursor-pointer hover:brightness-105"
                }`}
              >
                {/* 1. INTERIOR (always rendered if unlocked or lid is falling) */}
                {(isBoxUnlocked || isLidFalling) && (
                  <div className="absolute inset-2 bg-[#1a130d] border border-[#2b1f15] rounded shadow-inner flex items-center justify-center overflow-hidden">
                    {!hasItem("recipe-book") && !pickedUp && (
                      <motion.div
                        className="w-[60%] h-[60%] cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 flex items-center justify-center z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPickupItem("recipe-book", e);
                          setTimeout(() => setPickedUp(true), 300);
                        }}
                      >
                        <img
                          src="https://i.postimg.cc/T2L7WNRK/ywmn.png"
                          className="w-full h-full object-contain filter drop-shadow-xl"
                          alt="Diary"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {/* 2. LID (only rendered if NOT box unlocked - if falling, it is animated to slip down the screen) */}
                {!isBoxUnlocked && (
                  <motion.div
                    animate={isLidFalling ? {
                      y: "120%",
                      rotate: 15,
                      opacity: 0,
                    } : {}}
                    transition={{
                      duration: 0.9,
                      ease: [0.3, 0.05, 0.15, 0.95]
                    }}
                    onAnimationComplete={() => {
                      if (isLidFalling && onUnlockBox) {
                        onUnlockBox();
                      }
                    }}
                    className={`absolute inset-0 bg-[#2b1f15] rounded-md flex flex-col items-center justify-center p-4 z-20 ${
                      isLidFalling ? "pointer-events-none" : "pointer-events-auto"
                    }`}
                  >
                    {/* Corner Screws */}
                    {/* Top Left */}
                    <div className="absolute top-2 left-2 w-7 h-7">
                      {screws[0] ? (
                        <div
                          className="w-full h-full bg-stone-300 rounded-full border-2 border-stone-500 flex items-center justify-center cursor-pointer hover:bg-stone-100 shadow-md active:scale-90 transition-all relative overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedItem === "screwdriver") onScrewClick(0);
                          }}
                        >
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 -rotate-45"></div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 0, y: 0, opacity: 1 }}
                          animate={{ rotate: 720, y: "150px", opacity: 0 }}
                          transition={{ duration: 1, ease: "easeIn" }}
                          className="w-full h-full bg-stone-400 rounded-full border border-stone-600 flex items-center justify-center relative overflow-hidden pointer-events-none"
                        >
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 -rotate-45"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Top Right */}
                    <div className="absolute top-2 right-2 w-7 h-7">
                      {screws[1] ? (
                        <div
                          className="w-full h-full bg-stone-300 rounded-full border-2 border-stone-500 flex items-center justify-center cursor-pointer hover:bg-stone-100 shadow-md active:scale-90 transition-all relative overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedItem === "screwdriver") onScrewClick(1);
                          }}
                        >
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 -rotate-45"></div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 0, y: 0, opacity: 1 }}
                          animate={{ rotate: 720, y: "150px", opacity: 0 }}
                          transition={{ duration: 1, ease: "easeIn" }}
                          className="w-full h-full bg-stone-400 rounded-full border border-stone-600 flex items-center justify-center relative overflow-hidden pointer-events-none"
                        >
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 -rotate-45"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Left */}
                    <div className="absolute bottom-2 left-2 w-7 h-7">
                      {screws[2] ? (
                        <div
                          className="w-full h-full bg-stone-300 rounded-full border-2 border-stone-500 flex items-center justify-center cursor-pointer hover:bg-stone-100 shadow-md active:scale-90 transition-all relative overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedItem === "screwdriver") onScrewClick(2);
                          }}
                        >
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 -rotate-45"></div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 0, y: 0, opacity: 1 }}
                          animate={{ rotate: 720, y: "150px", opacity: 0 }}
                          transition={{ duration: 1, ease: "easeIn" }}
                          className="w-full h-full bg-stone-400 rounded-full border border-stone-600 flex items-center justify-center relative overflow-hidden pointer-events-none"
                        >
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 -rotate-45"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Right */}
                    <div className="absolute bottom-2 right-2 w-7 h-7">
                      {screws[3] ? (
                        <div
                          className="w-full h-full bg-stone-300 rounded-full border-2 border-stone-500 flex items-center justify-center cursor-pointer hover:bg-stone-100 shadow-md active:scale-90 transition-all relative overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedItem === "screwdriver") onScrewClick(3);
                          }}
                        >
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[15%] bg-stone-600 -rotate-45"></div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 0, y: 0, opacity: 1 }}
                          animate={{ rotate: 720, y: "150px", opacity: 0 }}
                          transition={{ duration: 1, ease: "easeIn" }}
                          className="w-full h-full bg-stone-400 rounded-full border border-stone-600 flex items-center justify-center relative overflow-hidden pointer-events-none"
                        >
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 rotate-45"></div>
                          <div className="absolute w-[60%] h-[12%] bg-stone-600 -rotate-45"></div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {index === 3 && isOpen && (
            <div className="relative w-full h-full flex items-center justify-center z-10">
              <div
                className="w-[52.5%] h-[52.5%] flex items-center justify-center"
                style={{ transform: "translateY(15%)" }}
              >
                {!hasItem("pan") && !pickedItems.includes("pan") && (
                  <motion.div
                    className="w-full h-full cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100"
                    onClick={(e) => handlePick("pan", e)}
                  >
                    <img
                      src="https://i.postimg.cc/6qjzxXhM/mhbt.png"
                      className="w-full h-full object-contain drop-shadow-xl"
                      alt="Pan"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}
              </div>
              {(hasItem("pan") || pickedItems.includes("pan")) && null}
            </div>
          )}

          <motion.div
            animate={{ x: isOpen ? "-100%" : "0%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 border-4 border-[#5c7a5c] bg-[#2b4a2b] flex items-center justify-end pr-8 cursor-pointer shadow-xl z-20 origin-left"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-4 h-1/3 bg-[#7a9b7a] rounded-sm shadow-sm"></div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none opacity-50 z-30"></div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const BedroomLetterCloseUp = ({ 
  onClose, 
  onLeaveDetails 
}: { 
  onClose: () => void; 
  onLeaveDetails: () => void; 
}) => {
  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1.5}>
      <div className="absolute inset-0 bg-[#f9f7f1] overflow-y-auto p-6 md:p-10 font-sans text-[#2a2a2a]" dir="rtl">
        <div className="w-[90%] md:w-[80%] mx-auto pb-10 filter drop-shadow-md bg-white p-6 md:p-12 rotate-[1deg] border border-[#e5e5e5]">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-black border-b border-gray-300 pb-2">חברים יקרים,</h2>
            <p className="mb-4 text-base md:text-lg leading-relaxed">אם אתם קוראים את זה אני כבר רחוק מכאן.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">לא נרצחתי. הצבע האדום הגיע מהסטודיו של הצייר — סליחה על הבלגן. הייתי צריך שזה ייראה אמיתי.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">הייתה לי הופעה. הופעה סודית. כזו שלא יכולתי לפספס, וגם לא יכולתי להסביר לכם.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">ידעתי שאם אגיד שאני יוצא, תשאלו לאן. ואם תדעו לאן, תבואו. ואם תבואו - תהרסו את הכל.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">הכל היה כדי שתהיו עסוקים מספיק זמן. לא התכוונתי לגרום נזק לאף אחד. רק הייתי צריך כמה דקות של בלבול.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">ברחתי דרך החלון ברגע שנעלתם את הדלת.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">סליחה שהייתי צריך להשאיר אתכם מאחור.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">אבל אני צריך להמשיך לאלבום הבא.</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">ואם תרצו להגיע להופעה הסודית,</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">תשאירו את הפרטים שלכם כאן</p>
            <p className="mb-4 text-base md:text-lg leading-relaxed">ונשלח לכם כרטיס.</p>
            <p className="mb-6 font-bold text-lg md:text-xl transform rotate-[-2deg] text-red-700 bg-red-50 p-3 italic incline-block border-l-4 border-red-500 shadow-sm">אבל תדעו שיש רק 50 כרטיסים אז כל הקודם זוכה!</p>
            
            <div className="my-8 text-center bg-transparent">
                <button 
                  className="bg-black text-white px-8 py-4 rounded font-bold shadow-lg hover:bg-gray-800 transition transform hover:scale-105"
                  onClick={onLeaveDetails}
                >
                  להשארת פרטים
                </button>
            </div>
            
            <p className="mt-8 font-bold text-xl md:text-2xl text-black">בהצלחה, ניר</p>
        </div>
      </div>
    </CloseUpContainer>
  );
};

interface Participant {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  timestamp?: string;
  createdAt: string;
}

const LeaveDetailsView = ({ onClose }: { onClose: () => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketNum, setTicketNum] = useState(0);
  const [existingCount, setExistingCount] = useState(0);
  const [isPortrait, setIsPortrait] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showEndScreen, setShowEndScreen] = useState(false);

  useEffect(() => {
    // Read count from Firestore in real-time
    const unsubscribe = onSnapshot(collection(db, "participants"), (snapshot) => {
      setExistingCount(snapshot.size);
    }, (error) => {
      console.error("Failed to fetch real-time count from firestore:", error);
      // Fallback to local storage count
      try {
        const stored = localStorage.getItem("secret_show_participants");
        if (stored) {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr)) {
            setExistingCount(arr.length);
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !birthDate) {
      setErrorMsg("אנא מלאו את כל השדות בצורה תקינה כדי להמשיך.");
      return;
    }

    const timestampStr = new Date().toLocaleString("he-IL");
    const newParticipantData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      birthDate,
      createdAt: timestampStr,
    };

    // Keep saving to localStorage as a robust local backup
    let localList: Participant[] = [];
    try {
      const stored = localStorage.getItem("secret_show_participants");
      if (stored) {
        localList = JSON.parse(stored);
        if (!Array.isArray(localList)) localList = [];
      }
    } catch (err) {
      localList = [];
    }
    localList.push({ ...newParticipantData, timestamp: timestampStr });
    try {
      localStorage.setItem("secret_show_participants", JSON.stringify(localList));
    } catch (e) {
      console.error(e);
    }

    try {
      // Save to global Firestore database
      await addDoc(collection(db, "participants"), newParticipantData);
      
      // Get the real-time global list count to show on the ticket
      const querySnapshot = await getDocs(collection(db, "participants"));
      setTicketNum(querySnapshot.size);
    } catch (err) {
      console.error("Failed saving to Firestore database:", err);
      // Fallback ticket number to local list length
      setTicketNum(localList.length);
      try {
        handleFirestoreError(err, OperationType.WRITE, "participants");
      } catch (firebaseErr: any) {
        console.warn("Soft error logging:", firebaseErr);
      }
    }
    
    setSubmitted(true);
  };

  const remainingTickets = Math.max(0, 50 - existingCount);

  // If showcase final celebration screen
  if (showEndScreen) {
    return (
      <div className="fixed inset-0 bg-[#0c0a09] z-[250] text-white flex flex-col justify-center items-center font-sans p-6 text-center select-none" dir="rtl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full flex flex-col items-center bg-zinc-915 bg-neutral-900 border border-zinc-800 p-10 rounded-[32px] shadow-2xl relative overflow-hidden"
        >
          {/* Ambient party glow */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none"></div>
          
          <div className="text-6xl mb-6 animate-bounce">🎫</div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-wide text-white leading-tight">תודה רבה ששיחקתם!</h1>
          <p className="text-red-500 text-2xl font-black tracking-wider mb-8 drop-shadow-sm">נתראה בהופעה :)</p>
          
          <div className="w-full border-t border-dashed border-zinc-850 mt-4 pt-6 text-zinc-500 text-[10px] tracking-widest font-mono">
            SECRETS OF NIR • ALL RIGHTS RESERVED 2026
          </div>
        </motion.div>
      </div>
    );
  }

  // If landscape, force rotation
  if (!isPortrait) {
    return (
      <div className="fixed inset-0 bg-zinc-950 text-white z-[250] flex flex-col items-center justify-between p-8 text-center select-none" dir="rtl">
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-32 border-4 border-dashed border-red-500 rounded-3xl relative mb-8 flex items-center justify-center bg-zinc-900 shadow-inner">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-zinc-700 rounded-full"></div>
              <RefreshCw size={36} className="text-red-500 animate-[spin_8s_linear_infinite]" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-red-500 tracking-wide">נא לסובב למצב אנכי (לאורך)</h2>
          </motion.div>
        </div>
        
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 border-t border-zinc-800/60 pt-6">
          <button 
            onClick={onClose}
            className="w-full bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-md"
          >
            חזרה לחדר המשחק
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-white z-[250] text-[#111111] flex flex-col items-center justify-center font-sans overflow-hidden" dir="rtl">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-red-100/30 to-transparent pointer-events-none"></div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full bg-white flex flex-col items-center justify-center text-center relative py-4 px-4 md:py-8 md:px-6 overflow-y-auto overflow-x-hidden"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 border-2 border-red-500 flex-shrink-0">
            <Check size={28} className="text-red-650" />
          </div>
          <h2 className="text-xl md:text-3xl font-black mb-1 md:mb-2 text-zinc-900">הפרטים נשמרו בהצלחה!</h2>
          <p className="text-xs md:text-base mb-1 md:mb-2 leading-relaxed text-zinc-500">נרשמתם בהצלחה לרשימת המוזמנים של ההופעה הסודית של ניר!</p>
          <p className="text-xs md:text-base mb-3 md:mb-5 font-bold leading-relaxed text-zinc-800">אימייל עם כל הפרטים ישלח לכתובת האימייל שהזנתם.</p>
          
          <div className="border-4 border-double border-gray-300 p-6 md:p-8 rounded-2xl bg-amber-50/55 my-1 md:my-4 relative overflow-hidden text-right w-full max-w-lg min-h-[300px] md:min-h-[380px] flex flex-col justify-between shadow-sm flex-shrink-0">
            <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-white rounded-full -translate-y-1/2 border-l-2 border-gray-300"></div>
            <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-white rounded-full -translate-y-1/2 border-r-2 border-gray-300"></div>
            
            <div className="border-b border-dashed border-gray-300 pb-3 mb-3 md:mb-4 text-center relative flex-shrink-0">
              <div className="absolute top-1 left-0 text-[11px] font-mono font-bold text-zinc-400 select-none tracking-wide" dir="ltr">
                #{ticketNum.toString().padStart(3, '0')}
              </div>
              <div className="text-xl md:text-2xl font-black text-zinc-900 tracking-wide leading-tight mb-1">
                "נקודת תורפה"
              </div>
              <div className="text-xs md:text-base font-bold text-zinc-700">
                הופעה סודית - השמעת אלבום שני
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-zinc-800 flex-grow flex flex-col justify-center">
              <div className="flex flex-row items-baseline gap-2">
                <span className="text-zinc-500 font-medium whitespace-nowrap">שם מלא:</span>
                <strong className="break-words font-bold md:font-extrabold">{firstName} {lastName}</strong>
              </div>
              <div className="flex flex-row items-baseline gap-2">
                <span className="text-zinc-500 font-medium font-sans whitespace-nowrap">טלפון:</span>
                <strong className="font-mono text-[14px] md:text-lg font-bold md:font-semibold">{phone}</strong>
              </div>
              <div className="flex flex-row items-baseline gap-2">
                <span className="text-zinc-500 font-medium font-sans whitespace-nowrap w-auto">אימייל:</span>
                <div className="flex-1 text-right">
                  <strong className="font-mono text-[14px] md:text-lg break-all inline-block font-bold md:font-semibold" dir="ltr">{email}</strong>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-dashed border-gray-300 text-center text-xs md:text-sm text-red-650 font-black bg-white/70 py-2 md:py-3 rounded-xl shadow-sm border-2 border-white/50 flex-shrink-0">
              מומלץ לצלם מסך זה כמזכרת!
            </div>
          </div>
          
          <button 
            onClick={() => setShowEndScreen(true)}
            className="w-full max-w-md bg-neutral-900 hover:bg-black text-white font-extrabold py-4 px-6 rounded-2xl transition shadow-lg text-lg mt-6 active:scale-95"
          >
            סיום
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[250] text-[#111111] flex flex-col font-sans overflow-hidden" dir="rtl">
      {/* Background design elements */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-red-100/20 to-transparent pointer-events-none"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full bg-white flex flex-col relative overflow-y-auto"
      >
        {/* Top Header */}
        <div className="py-6 px-6 md:px-12 border-b border-zinc-100 flex items-center justify-between flex-shrink-0 sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wide text-zinc-900">ההופעה הסודית של ניר</h1>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all active:scale-90 text-zinc-700"
            title="סגירה"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content body with responsive sizing */}
        <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 md:py-12 relative flex flex-col min-h-0">
          {/* Ticket counter badge */}
          <div className="mb-8 md:mb-12 flex items-center justify-center">
            <span className="px-5 py-2 md:text-sm bg-red-50 border border-red-200 text-red-600 text-xs font-black rounded-full shadow-sm animate-pulse flex items-center gap-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              רק עוד {remainingTickets} כרטיסים נותרו מתוך 50!
            </span>
          </div>

          {/* Form description card */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-zinc-950">טופס השארת פרטים לקבלת כרטיס</h2>
          </div>

          {/* Alert message directly in React */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-50 border-r-4 border-red-600 rounded-xl text-red-800 text-xs flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </motion.div>
          )}

          {/* Input Fields specifically optimized for full screen heights */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-zinc-700 font-bold mb-1 mr-1 text-xs">שם פרטי</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 pointer-events-none">
                    <User size={15} />
                  </span>
                  <input 
                    type="text"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-zinc-300 text-black text-base transition-all focus:bg-white"
                    placeholder="הקלידו שם פרטי"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1 mr-1 text-xs">שם משפחה</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 pointer-events-none">
                    <User size={15} />
                  </span>
                  <input 
                    type="text"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-zinc-300 text-black text-base transition-all focus:bg-white"
                    placeholder="הקלידו שם משפחה"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1 mr-1 text-xs">כתובת אימייל</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 pointer-events-none">
                    <Mail size={15} />
                  </span>
                  <input 
                    type="email"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-zinc-300 text-black text-base transition-all text-left dir-lte focus:bg-white"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1 mr-1 text-xs">טלפון נייד</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 pointer-events-none">
                    <Phone size={15} />
                  </span>
                  <input 
                    type="tel"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-zinc-300 text-black text-base transition-all text-left dir-lte focus:bg-white"
                    placeholder="050-0000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1 mr-1 text-xs">תאריך לידה</label>
                <div className="relative font-sans">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 pointer-events-none">
                    <Calendar size={15} />
                  </span>
                  <input 
                    type="date"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-zinc-300 text-black text-base transition-all text-right focus:bg-white"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 pb-6 mt-auto">
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] text-lg"
              >
                שליחה ואישור הרשמה לקבלת כרטיס
              </button>
              <p className="text-center text-[10px] text-zinc-400 mt-3 font-sans">פרטיכם מאובטחים ולא יועברו לכל גורם חיצוני.</p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};


const ParticipantsTableView = ({ onClose }: { onClose: () => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    // Listen to firestore database updates in real-time
    const unsubscribe = onSnapshot(collection(db, "participants"), (snapshot) => {
      const list: Participant[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          birthDate: data.birthDate || "",
          createdAt: data.createdAt || data.timestamp || "",
        });
      });
      setParticipants(list);
    }, (error) => {
      console.error("Firestore real-time subscription error:", error);
      // Fallback to local storage list
      try {
        const stored = localStorage.getItem("secret_show_participants");
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            setParticipants(list.map((p, idx) => ({
              ...p,
              id: p.id || `local-${idx}`,
              createdAt: p.createdAt || p.timestamp || "",
            })));
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setShowConfirmDelete(false);
  }, [selectedRowIndex]);

  const handleDeleteSelected = async () => {
    if (selectedRowIndex === null) return;
    const selectedParticipant = participants[selectedRowIndex];
    if (!selectedParticipant) return;

    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    // Try deleting from Firestore first
    if (selectedParticipant.id && !selectedParticipant.id.startsWith("local-")) {
      try {
        await deleteDoc(doc(db, "participants", selectedParticipant.id));
      } catch (error) {
        console.error("Failed to delete from Firestore:", error);
        try {
          handleFirestoreError(error, OperationType.DELETE, `participants/${selectedParticipant.id}`);
        } catch (firebaseErr: any) {
          console.warn("Soft error logging during deletion:", firebaseErr);
        }
      }
    }

    // Always keep fallback in sync
    try {
      const stored = localStorage.getItem("secret_show_participants");
      if (stored) {
        let list = JSON.parse(stored);
        if (Array.isArray(list)) {
          list = list.filter((p: any) => {
            if (selectedParticipant.id && selectedParticipant.id === p.id) return false;
            return p.email !== selectedParticipant.email || p.phone !== selectedParticipant.phone;
          });
          localStorage.setItem("secret_show_participants", JSON.stringify(list));
        }
      }
    } catch (e) {
      console.error(e);
    }

    setSelectedRowIndex(null);
    setShowConfirmDelete(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-[120] p-4 md:p-8 text-white text-right font-sans" dir="rtl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 border-2 border-red-950 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] max-w-md w-full p-8 flex flex-col relative overflow-hidden"
        >
          {/* Subtle decorative glowing corner */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/10 rounded-full blur-xl"></div>
          
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <Lock size={28} className="animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-red-500 tracking-tight">כניסת מנהל מערכת</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              רשימת המוזמנים חסומה ומאובטחת. אנא הזן את הסיסמה הסודית כדי להמשיך.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === "פודינג!") {
              setIsAuthenticated(true);
              setPasswordError("");
            } else {
              setPasswordError("סיסמה שגויה! הגישה נדחתה.");
              setPasswordInput("");
            }
          }} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5 text-xs mr-1">סיסמה חסומה</label>
              <input 
                type="text"
                required
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-white text-lg tracking-widest placeholder:text-slate-700 hover:border-slate-700 transition-all font-mono"
                placeholder="הקלד/י סיסמה..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError("");
                }}
              />
            </div>

            {passwordError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs text-center font-bold bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg flex items-center justify-center gap-1.5"
              >
                <AlertCircle size={14} />
                <span>{passwordError}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-red-600/10 transition-all cursor-pointer text-sm"
            >
              אימות סיסמה ויציאה מרשימת המתנה
            </button>
          </form>

          <button 
            type="button"
            onClick={onClose}
            className="w-full mt-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs transition border border-slate-800 font-bold"
          >
            ביטול וחזרה למשחק
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-[120] p-4 md:p-8 text-white text-right" dir="rtl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-red-500 flex items-center gap-2">
              <span>📋 רשימת נרשמים להופעה הסודית</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-normal">
                {participants.length} רשומים
              </span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">מצב ניהול סודי - מציג את כל מי שהשאיר פרטים בחדר השינה</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedRowIndex !== null ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDeleteSelected}
                  className={`${showConfirmDelete ? "bg-amber-600 hover:bg-amber-700 focus:ring-yellow-400 animate-pulse" : "bg-red-600 hover:bg-red-700"} text-white font-bold p-2 px-4 rounded-xl transition flex items-center gap-1.5 text-xs mr-2 border border-red-500/50 shadow-md`}
                  title="מחק שורה נבחרת"
                >
                  <Trash2 size={16} />
                  <span>{showConfirmDelete ? "בטוח? לחצו שוב לאישור מחיקה סופי" : "מחיקת השורה הנבחרת"}</span>
                </button>
                {showConfirmDelete && (
                  <button 
                    onClick={() => setShowConfirmDelete(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-zinc-300 p-2 px-3 rounded-xl text-xs border border-slate-700 transition font-bold"
                  >
                    ביטול
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/40 text-slate-400 border border-slate-700/60 p-2 px-3 rounded-xl flex items-center gap-1.5 text-xs mr-2 cursor-default select-none font-sans">
                <span>לחצו על שורה כדי לבחור ולמחוק</span>
              </div>
            )}
            <button 
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 font-sans">
          {participants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
              <p className="text-lg">אף אחד עדיין לא השאיר פרטים.</p>
              <p className="text-sm mt-1 opacity-70">חברים יצטרכו ללחוץ על המכתב במיטה כדי למלא פרטים.</p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <th className="p-4 border-l border-slate-800 w-16 text-center">בחירה</th>
                    <th className="p-4 border-l border-slate-800">טור 1: שם</th>
                    <th className="p-4 border-l border-slate-800">טור 2: שם משפחה</th>
                    <th className="p-4 border-l border-slate-800">טור 3: אימייל</th>
                    <th className="p-4 border-l border-slate-800">טור 4: טלפון</th>
                    <th className="p-4 border-l border-slate-800">טור 5: תאריך לידה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {participants.map((person, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedRowIndex(selectedRowIndex === idx ? null : idx)}
                      className={`cursor-pointer transition-colors ${selectedRowIndex === idx ? "bg-red-950/40 hover:bg-slate-800/40" : "hover:bg-slate-800/30 text-slate-300"}`}
                    >
                      <td className="p-4 border-l border-slate-800 text-center">
                        <div className={`w-4 h-4 mx-auto rounded-full border flex items-center justify-center transition-all ${selectedRowIndex === idx ? "border-red-500 bg-red-600" : "border-slate-600 bg-transparent"}`}>
                          {selectedRowIndex === idx && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </td>
                      <td className="p-4 border-l border-slate-800 font-semibold">{person.firstName}</td>
                      <td className="p-4 border-l border-slate-800">{person.lastName}</td>
                      <td className="p-4 border-l border-slate-800 font-mono text-xs select-text">{person.email}</td>
                      <td className="p-4 border-l border-slate-800 font-mono text-xs select-text">{person.phone}</td>
                      <td className="p-4 border-l border-slate-800">{person.birthDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>מקשים: Ctrl + Enter פותח/סוגר מסך זה</span>
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl transition font-medium"
          >
            חזרה למשחק
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const KitchenDrawer = ({
  onClose,
  onPickupItem,
  hasItem,
  isFusePlaced,
}: {
  onClose: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  isFusePlaced: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickedUp, setPickedUp] = useState(false);
  const [hookPicked, setHookPicked] = useState(false);
  return (
    <CloseUpContainer onClose={onClose} aspectRatio={2 / 1}>
      <div className="w-full h-full relative">
        <div className="absolute inset-0 border-8 border-[#5c6b6b] bg-[#1f2424]">
          <div className="absolute top-0 left-0 w-full h-[40%] z-10">
            {!hasItem("fuse") && !isFusePlaced && !pickedUp && (
              <div
                className="absolute top-1/2 left-[15%] -translate-y-1/2 h-[48%] aspect-[5/2] border-2 border-[#4a5560] bg-[#2c343b] flex items-center justify-between px-[5%] cursor-pointer hover:brightness-110 active:scale-95 transition-all duration-100 shadow-xl overflow-hidden rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickupItem("fuse", e);
                  setTimeout(() => setPickedUp(true), 300);
                }}
              >
                <div className="w-[60%] h-[20%] bg-[#cbd5e1] rounded-sm"></div>
                <div className="w-[20%] aspect-square max-h-[80%] rounded-full bg-[#ff4a4a] shadow-[0_0_20px_#ff4a4a] flex-shrink-0"></div>
              </div>
            )}
            {!hasItem("hook") && !hasItem("hook-string") && !hookPicked && (
              <div
                className="absolute top-1/2 right-[25%] -translate-y-1/2 h-[130%] aspect-square cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickupItem("hook", e);
                  setTimeout(() => setHookPicked(true), 300);
                }}
              >
                <img
                  src="https://i.postimg.cc/zDxmns4n/הוק.png"
                  className="w-[150%] h-[150%] object-contain filter drop-shadow-lg"
                  alt="וו"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
          <motion.div
            animate={{ y: isOpen ? "40%" : "0%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 border-4 border-[#7a8b8b] bg-[#3d4545] flex flex-col items-center cursor-pointer shadow-xl z-20"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-1/3 h-4 bg-[#9aa8a8] mt-8 rounded-sm flex items-center justify-center shadow-sm"></div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none opacity-80 z-30"></div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const Fridge = ({
  onClose,
  onInspectBox,
  onInspectInterior,
}: {
  onClose: () => void;
  onInspectBox: () => void;
  onInspectInterior: () => void;
}) => {
  const [freezerOpen, setFreezerOpen] = useState(false);
  const [fridgeOpen, setFridgeOpen] = useState(false);
  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1 / 2.5}>
      <div className="w-full h-full relative border-8 border-[#5c6b6b] bg-[#1f2424] flex flex-col">
        <div className="flex-[2] relative border-b-4 border-[#5c6b6b]">
          <div className="absolute inset-0 p-4 flex flex-col gap-2 bg-[#e0e5e5]">
            <div className="w-full h-2 border-b-2 border-[#9aa8a8] border-dashed opacity-50"></div>
            <div className="w-1/2 h-8 border-2 border-[#9aa8a8] bg-white/50 opacity-50"></div>
            <div
              className="absolute bottom-4 right-4 w-16 h-12 bg-[#a0aab5] border border-[#808e9b] rounded-sm cursor-pointer hover:bg-[#909aab] transition-colors flex flex-col items-center justify-center shadow-sm z-0"
              onClick={(e) => {
                e.stopPropagation();
                onInspectBox();
              }}
            >
              <div className="w-8 h-2 bg-gray-300 rounded-sm mb-1"></div>
              <div className="w-6 h-1 bg-gray-400 rounded-sm"></div>
            </div>
          </div>
          <motion.div
            animate={{ rotateY: freezerOpen ? -110 : 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="absolute inset-0 border-4 border-[#7a8b8b] bg-[#d1d5d5] origin-left cursor-pointer flex items-center justify-end pr-4 shadow-lg z-10"
            onClick={() => setFreezerOpen(!freezerOpen)}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-2 h-16 bg-[#9aa8a8] rounded-sm"></div>
          </motion.div>
        </div>
        <div className="flex-[4] relative">
          <div className="absolute inset-0 p-4 flex flex-col gap-4 sm:gap-8 opacity-50 bg-[#e0e5e5]">
            <div className="w-full h-2 border-b-2 border-[#9aa8a8]"></div>
            <div className="w-full h-2 border-b-2 border-[#9aa8a8]"></div>
            <div className="w-full h-2 border-b-2 border-[#9aa8a8]"></div>
            <div className="mt-auto flex gap-2 h-16 sm:h-24">
              <div className="flex-1 border-2 border-[#9aa8a8] bg-white/50"></div>
              <div className="flex-1 border-2 border-[#9aa8a8] bg-white/50"></div>
            </div>
            {fridgeOpen && (
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectInterior();
                }}
              ></div>
            )}
          </div>
          <motion.div
            animate={{ rotateY: fridgeOpen ? -110 : 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="absolute inset-0 border-4 border-[#7a8b8b] bg-[#d1d5d5] origin-left cursor-pointer flex items-center justify-end pr-4 shadow-lg z-10"
            onClick={() => setFridgeOpen(!fridgeOpen)}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-2 h-32 bg-[#9aa8a8] rounded-sm"></div>
          </motion.div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const FridgeInteriorCloseUp = ({
  onClose,
  onPickupItem,
  hasItem,
}: {
  onClose: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
}) => {
  const [pickedItems, setPickedItems] = useState<string[]>([]);

  const handlePick = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPickupItem(item, e);
    setTimeout(() => setPickedItems((prev) => [...prev, item]), 300);
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1 / 1}>
      <div className="w-full h-full bg-[#f0f4f4] border-8 border-[#d1d5d5] shadow-2xl relative flex flex-col p-2 gap-4">
        {/* Shelves */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-full h-1 bg-[#d1d5d5] border-b border-[#a0aab5] relative mt-[20%]"
          >
            {/* Shelf 0: Milk & Eggs */}
            {i === 0 && (
              <div className="absolute bottom-0 left-0 w-full flex justify-between items-end px-[15%] z-50">
                <div className="w-16 h-20 flex items-end justify-center">
                  {!hasItem("milk") && !pickedItems.includes("milk") && (
                    <motion.div
                      className="w-16 h-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 origin-bottom"
                      onClick={(e) => handlePick("milk", e)}
                    >
                      <img
                        src="https://i.postimg.cc/QC7TfVpd/חלב.png"
                        className="w-full h-full object-contain drop-shadow-md pb-1"
                        alt="Milk"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  )}
                </div>
                <div className="w-24 h-16 flex items-end justify-center">
                  {!hasItem("eggs") && !pickedItems.includes("eggs") && (
                    <motion.div
                      className="w-24 h-16 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 origin-bottom"
                      onClick={(e) => handlePick("eggs", e)}
                    >
                      <img
                        src="https://i.postimg.cc/4yc9Wnzf/ביצים.png"
                        className="w-full h-full object-contain drop-shadow-md pb-1"
                        alt="Eggs"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            )}
            {/* Shelf 1: Cream */}
            {i === 1 && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-16 flex items-end justify-center z-50">
                {!hasItem("cream") && !pickedItems.includes("cream") && (
                  <motion.div
                    className="w-14 h-16 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 origin-bottom"
                    onClick={(e) => handlePick("cream", e)}
                  >
                    <img
                      src="https://i.postimg.cc/vTnV0DW4/שמנת.png"
                      className="w-full h-full object-contain drop-shadow-md pb-1"
                      alt="Cream"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}
              </div>
            )}
            {/* Shelf 2: Chicken */}
            {i === 2 && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 flex items-end justify-center z-50">
                {!hasItem("chicken") && !pickedItems.includes("chicken") && (
                  <motion.div
                    className="w-24 h-16 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 origin-bottom"
                    onClick={(e) => handlePick("chicken", e)}
                  >
                    <img
                      src="https://i.postimg.cc/ZnNdw0r0/עוף.png"
                      className="w-full h-full object-contain drop-shadow-md pb-1"
                      alt="Chicken"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}
              </div>
            )}
          </div>
        ))}
        {/* Bottom drawer area */}
        <div className="mt-auto w-full h-16 border-t-2 border-[#d1d5d5] flex gap-2">
          <div className="flex-1 bg-white/40 border border-[#d1d5d5] rounded-t-lg"></div>
          <div className="flex-1 bg-white/40 border border-[#d1d5d5] rounded-t-lg"></div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const StoveCloseUp = ({
  onClose,
  selectedItem,
  hasRecipe,
  isPotOnStove,
  isPastaInPot,
  isCreamInPot,
  onPlacePot,
  onPlacePasta,
  onPlaceCream,
  onMissingRecipeError,
  onChefError,
  onPickupPasta,
}: {
  onClose: () => void;
  selectedItem: string | null;
  hasRecipe: boolean;
  isPotOnStove: boolean;
  isPastaInPot: boolean;
  isCreamInPot: boolean;
  onPlacePot: () => void;
  onPlacePasta: () => void;
  onPlaceCream: () => void;
  onMissingRecipeError: () => void;
  onChefError: () => void;
  onPickupPasta: (e: React.MouseEvent) => void;
}) => {
  const handleInteraction = (e: React.MouseEvent) => {
    if (isCreamInPot) {
      // Handled by the pot directly to avoid animating the stove
      return;
    }

    if (!isPotOnStove) {
      if ((selectedItem === "pot" || selectedItem === "pan") && !hasRecipe) {
        onMissingRecipeError();
      } else if (selectedItem === "pot") {
        onPlacePot();
      } else if (selectedItem) {
        onChefError();
      }
    } else if (!isPastaInPot) {
      if (selectedItem === "pasta") {
        onPlacePasta();
      } else if (selectedItem) {
        onChefError();
      }
    } else if (!isCreamInPot) {
      if (selectedItem === "cream") {
        onPlaceCream();
      } else if (selectedItem) {
        onChefError();
      }
    }
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={4 / 3}>
      <div className="w-full h-full bg-[#1a1c20] border-8 border-[#3a3f47] rounded-xl relative shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Countertop texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Stove top */}
        <div
          className="w-[80%] h-[80%] bg-black border-4 border-[#333] rounded-lg relative flex items-center justify-center cursor-pointer"
          onClick={handleInteraction}
        >
          {/* Burners */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-8 gap-8 opacity-40">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border-4 border-red-900/30 rounded-full flex items-center justify-center"
              >
                <div className="w-3/4 h-3/4 border-2 border-red-900/20 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Pot on stove */}
          {isPotOnStove && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`relative w-[40cqw] h-[40cqw] z-10 flex items-center justify-center ${isCreamInPot ? "cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100" : "pointer-events-none"}`}
              onClick={(e) => {
                if (isCreamInPot) {
                  e.stopPropagation();
                  onPickupPasta(e);
                }
              }}
            >
              {!isPastaInPot ? (
                <img
                  src="https://i.postimg.cc/FsQd9ryT/syr-lm_lh.png"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  alt="Empty Pot Top View"
                  referrerPolicy="no-referrer"
                />
              ) : !isCreamInPot ? (
                <img
                  src="https://i.postimg.cc/MK8MW67L/syr-_m-psth.png"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  alt="Pot with Pasta"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src="https://i.postimg.cc/wTdy6qXP/syr-_m-psth-wsmnt.png"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  alt="Pot with Pasta and Cream"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </CloseUpContainer>
  );
};

const FuseBox = ({
  onClose,
  selectedItem,
  isFusePlaced,
  onPlaceFuse,
}: {
  onClose: () => void;
  selectedItem: string | null;
  isFusePlaced: boolean;
  onPlaceFuse: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  return (
    <CloseUpContainer onClose={onClose} aspectRatio={4 / 8}>
      <div
        className="w-[25cqw] h-[88.88cqh] relative"
        style={{ perspective: "100cqw" }}
      >
        <div className="absolute inset-0 border-8 border-[#3a3f47] bg-[#1a1c20] flex flex-col p-[10%] gap-[5%] shadow-inner overflow-hidden">
          {showSparks && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
              transition={{ duration: 0.5, ease: "linear" }}
              className="absolute inset-0 bg-[#4ade80]/30 mix-blend-screen pointer-events-none z-50 flex items-center justify-center shadow-[inset_0_0_50px_rgba(74,222,128,0.5)]"
            />
          )}
          {[...Array(4)].map((_, i) => {
            if (i === 2) {
              return (
                <div
                  key={i}
                  className={`flex-1 border-2 relative ${isFusePlaced ? "border-[#4a5560] bg-[#2c343b]" : "border-[#4a5560] border-dashed bg-[#1a1c20] opacity-50 cursor-pointer"} flex items-center justify-between px-[5%] shadow-inner rounded-md`}
                  onClick={() => {
                    if (!isFusePlaced && selectedItem === "fuse") {
                      setShowSparks(true);
                      setTimeout(() => {
                        setShowSparks(false);
                      }, 500);
                      onPlaceFuse();
                    }
                  }}
                >
                  {showSparks && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0, 1, 0, 0.5, 0] }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-md shadow-[0_0_20px_#4ade80] pointer-events-none z-10"
                    />
                  )}
                  {isFusePlaced && (
                    <>
                      <div className="w-[60%] h-[20%] bg-[#cbd5e1] rounded-sm relative z-20"></div>
                      <div className="w-[20%] aspect-square max-h-[80%] rounded-full bg-[#ff4a4a] shadow-[0_0_20px_#ff4a4a] flex-shrink-0 relative z-20"></div>
                    </>
                  )}
                </div>
              );
            }
            return (
              <div
                key={i}
                className="flex-1 border-2 border-[#4a5560] bg-[#2c343b] flex items-center justify-between px-[5%] shadow-inner rounded-md"
              >
                <div className="w-[60%] h-[20%] bg-[#cbd5e1] rounded-sm"></div>
                <div className="w-[20%] aspect-square max-h-[80%] rounded-full bg-[#ff4a4a] shadow-[0_0_20px_#ff4a4a] flex-shrink-0"></div>
              </div>
            );
          })}
        </div>
        <motion.div
          animate={{
            rotateY: isOpen ? -110 : 0,
            x: isOpen ? "-5%" : "0%",
          }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="absolute inset-0 origin-left cursor-pointer shadow-2xl z-20"
          onClick={() => setIsOpen(!isOpen)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 border-4 border-[#5c6b7a] bg-[#2c343b] flex items-center justify-end pr-4"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-2 h-16 bg-[#ff4a4a] rounded-sm"></div>
          </div>

          {/* Back Face (Inside of the door) */}
          <div
            className="absolute inset-0 border-4 border-[#5c6b7a] bg-[#2c343b] flex items-center justify-center"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src="https://i.postimg.cc/rsWf67Dm/qwd-X-3.png"
              alt="Clue"
              className="w-[60%] h-[60%] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </CloseUpContainer>
  );
};

const CarTrunkCloseUp = ({
  onClose,
  isCarOn,
  onPickupItem,
  hasItem,
  onMessage,
  onTrunkOpen,
}: {
  onClose: () => void;
  isCarOn?: boolean;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  onMessage?: (msg: string) => void;
  onTrunkOpen?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickedUp, setPickedUp] = useState(false);

  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(onClose, 800);
    } else {
      onClose();
    }
  };

  return (
    <CloseUpContainer onClose={handleClose} aspectRatio={1.5}>
      {/* Background/Environment */}
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-end items-center px-[5cqw] pb-[5cqw]">
        {/* Car Back Bumper */}
        <div className="w-[80%] h-[30%] bg-[#0a1520] absolute bottom-0 rounded-t-[5cqw] border-t-[0.4cqw] border-[#1a4a6b]/50 shadow-[0_-1cqw_2cqw_rgba(0,0,0,0.8)] z-30 pointer-events-none">
          {/* License Plate Area */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[30%] h-[40%] bg-yellow-400 border-[0.4cqw] border-black rounded-[0.5cqw] flex items-center justify-center shadow-inner">
            <div className="text-black font-mono font-bold tracking-widest text-[2cqw]">
              NT-26-327
            </div>
          </div>

          {/* Taillights */}
          <div
            className={`absolute top-[10%] left-[5%] w-[15%] h-[40%] bg-gradient-to-br ${isCarOn ? "from-red-500 to-red-800 shadow-[0_0_1.5cqw_rgba(220,38,38,0.8)] border-red-400" : "from-red-900/80 to-[#2a0808] border-red-900/50 shadow-none"} rounded-[1cqw] border transition-all duration-700`}
          ></div>
          <div
            className={`absolute top-[10%] right-[5%] w-[15%] h-[40%] bg-gradient-to-br ${isCarOn ? "from-red-500 to-red-800 shadow-[0_0_1.5cqw_rgba(220,38,38,0.8)] border-red-400" : "from-red-900/80 to-[#2a0808] border-red-900/50 shadow-none"} rounded-[1cqw] border transition-all duration-700`}
          ></div>
        </div>

        {/* The Open Trunk Interior */}
        <div className="absolute top-[20%] w-[65%] h-[50%] bg-[#080a0c] border-[0.5cqw] border-[#111] shadow-[inset_0_2cqw_5cqw_rgba(0,0,0,0.9)] z-10 flex items-end justify-center pb-[2cqw] perspective-[100cqw]">
          {/* Inside the trunk */}
          {isOpen && !hasItem("blue-paint") && !pickedUp && (
            <div
              className="absolute left-[20%] bottom-[5%] w-[15cqw] h-[15cqw] cursor-pointer drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-end justify-center hover:brightness-110 active:scale-95 transition-all outline outline-[0.2cqw] outline-transparent hover:outline-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onPickupItem("blue-paint", e);
                setTimeout(() => setPickedUp(true), 300);
              }}
              style={{ transform: "rotateX(10deg)" }}
            >
              <img
                src="https://i.postimg.cc/MGTsv6w2/dly-zb_-khwl-sgwr.png"
                alt="Blue Paint"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* The Configurable Trunk Lid */}
        <motion.div
          className="absolute top-[20%] w-[70%] h-[50%] bg-gradient-to-b from-[#1a4a6b] to-[#0a1520] border-[0.2cqw] border-white/20 z-20 cursor-pointer shadow-xl flex flex-col items-center justify-end pb-[2cqw] hover:brightness-110"
          initial={false}
          animate={{
            rotateX: isOpen ? 110 : 0,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{
            transformOrigin: "top",
            transformStyle: "preserve-3d",
            borderTopLeftRadius: "5cqw",
            borderTopRightRadius: "5cqw",
          }}
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && onTrunkOpen) onTrunkOpen();
          }}
        >
          {/* Spoiler or lip */}
          <div className="w-[80%] h-[1.5cqw] bg-white/10 rounded-full mb-[2cqw] shadow-inner"></div>
          {/* Logo / Badge */}
          <div className="w-[4cqw] h-[4cqw] rounded-full border-[0.3cqw] border-white/40 flex items-center justify-center bg-black/20 shadow-inner mb-[2cqw]">
            <div className="w-[2cqw] h-[0.4cqw] bg-white/30 skew-y-[45deg]"></div>
          </div>
        </motion.div>
      </div>
    </CloseUpContainer>
  );
};

const CarInterior = ({
  onClose,
  isUnlocked,
  onInspectLock,
  onPickupItem,
  hasItem,
  isCarOn,
  onToggleEngine,
  selectedItem,
  onMessage,
}: {
  onClose: () => void;
  isUnlocked: boolean;
  onInspectLock: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  isCarOn?: boolean;
  onToggleEngine?: () => void;
  selectedItem: string | null;
  onMessage: (msg: string) => void;
}) => {
  const [gloveBoxOpen, setGloveBoxOpen] = useState(isUnlocked);
  const [pickedUp, setPickedUp] = useState(false);

  useEffect(() => {
    if (isUnlocked) setGloveBoxOpen(true);
  }, [isUnlocked]);

  const handleGloveboxClick = () => {
    if (!isUnlocked) {
      onInspectLock();
    } else {
      setGloveBoxOpen(!gloveBoxOpen);
    }
  };

  return (
    <div
      className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-8 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl aspect-video relative border-8 border-[#1a1c20] bg-[#0a0c0e] overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-[10%] right-[10%] h-[40%] border-b-8 border-[#2a2d34] rounded-b-[100px] bg-gradient-to-b from-[#1a4a6b]/20 to-transparent"></div>

        {/* Steering Wheel */}
        <div className="absolute bottom-[10%] left-[10%] w-[35%] aspect-square border-8 border-[#2a2d34] bg-[#1a1c20] rounded-full flex items-center justify-center shadow-2xl">
          <div className="w-full h-4 bg-[#3a3f47]"></div>
          <div className="absolute w-4 h-full bg-[#3a3f47]"></div>
          <div className="w-[30%] aspect-square bg-[#101215] border-4 border-[#2a2d34] rounded-full absolute z-10 flex items-center justify-center">
            <div className="w-[40%] aspect-square border-2 border-[#4a5560] rounded-full"></div>
          </div>
        </div>

        {/* Ignition Keyhole / Button */}
        <div
          className="absolute bottom-[20%] left-[45%] w-12 h-12 bg-[#1a1c20] border-4 border-[#2a2d34] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#25282e] transition-colors group z-20 shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            if (selectedItem === "car-keys") {
              if (onToggleEngine) onToggleEngine();
            } else {
              if (onMessage) onMessage("יש להשתמש במפתח הרכב כדי להתניע");
            }
          }}
          title={isCarOn ? "לכבות מנוע" : "להתניע"}
        >
          {/* Key slot */}
          <div className="w-1.5 h-6 bg-black rounded-sm group-active:rotate-45 transition-transform origin-bottom"></div>
          {/* Status Indicator */}
          <div
            className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isCarOn ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,1)]" : "bg-red-500/50"}`}
          ></div>
        </div>

        {/* Glove Box */}
        <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[40%] border-4 border-[#2a2d34] bg-[#101215]">
          <div className="absolute inset-0 flex items-center justify-center">
            {isUnlocked &&
              gloveBoxOpen &&
              !pickedUp &&
              !hasItem("folded-paper") &&
              !hasItem("recipe") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-24 h-24 flex flex-col p-1.5 cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickupItem("folded-paper", e);
                    setPickedUp(true);
                  }}
                >
                  <img
                    src="https://i.postimg.cc/Twt6BccG/mtkwn-mqwpl.png"
                    alt="Folded Paper"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              )}
          </div>
          <motion.div
            animate={{ rotateX: gloveBoxOpen ? 60 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 border-2 border-[#3a3f47] bg-[#1a1c20] origin-bottom cursor-pointer flex justify-center pt-4 shadow-lg z-10"
            onClick={handleGloveboxClick}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-1/4 h-2 bg-[#4a5560] rounded-sm"></div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none opacity-80"></div>
        </div>
      </div>
      <ReturnButton onClick={onClose} />
    </div>
  );
};

const GloveboxLockCloseUp = ({
  onClose,
  onUnlock,
  selectedItem,
}: {
  onClose: () => void;
  onUnlock: () => void;
  selectedItem: string | null;
}) => {
  const [code, setCode] = useState([0, 0, 0, 0, 0]);

  const handleScroll = (index: number) => {
    setCode((prev) => {
      const newCode = [...prev];
      newCode[index] = (newCode[index] + 1) % 10;
      return newCode;
    });
  };

  const checkCode = () => {
    if (code.join("") === "89955") {
      onUnlock();
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-4 pointer-events-auto cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full h-full bg-[#2a2d34] border-8 border-[#1a1c20] rounded-xl flex flex-col items-center justify-center gap-8 shadow-2xl relative cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          dir="ltr"
          className="flex gap-3 bg-[#101215] p-6 rounded-lg border-4 border-[#3a3f47] shadow-inner"
        >
          {code.map((digit, i) => (
            <div
              key={i}
              className="w-14 h-20 bg-[#1a1c20] rounded border-2 border-[#4a5560] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative shadow-lg select-none"
              onClick={() => handleScroll(i)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${i}-${digit}`}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute text-3xl font-mono font-bold text-[#4ade80]"
                >
                  {digit}
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>
            </div>
          ))}
        </div>

        <button
          onClick={checkCode}
          className="w-16 h-16 bg-[#3a3f47] rounded-full border-4 border-[#4a5560] hover:bg-[#4a5560] transition-all shadow-xl flex items-center justify-center group"
        >
          <div className="w-6 h-6 rounded-full bg-[#4ade80]/20 border-2 border-[#4ade80] group-hover:scale-110 active:scale-95 transition-transform duration-100"></div>
        </button>
      </div>

      <ReturnButton onClick={onClose} />
    </motion.div>
  );
};

const PaintShelf = ({
  onClose,
  onPickupItem,
  hasItem,
}: {
  onClose: () => void;
  onPickupItem?: (item: string, e: React.MouseEvent) => void;
  hasItem?: (item: string) => boolean;
}) => {
  const [pickedUp, setPickedUp] = useState(false);
  const [aspect, setAspect] = useState(3 / 2);

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={aspect}>
      <div className="w-full h-full border-[0.5cqw] border-[#1a242a] bg-[#2b3a4a] flex items-center justify-center relative shadow-2xl overflow-hidden rounded-[1cqw]">
        <div className="w-[85%] h-[85%] relative">
          {/* Full coverage image of shelf & cans */}
          <img
            src="https://i.postimg.cc/9z5S7vpJ/dlyym-'l-hmdp.png"
            className="w-full h-full object-fill pointer-events-none"
            alt="Paint Cans and Shelf"
            referrerPolicy="no-referrer"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalHeight > 0) {
                setAspect(img.naturalWidth / img.naturalHeight);
              }
            }}
          />

          {/* Screwdriver positioned strictly via percentages to match the matched aspect ratio containers */}
          {!hasItem?.("screwdriver") && !pickedUp && (
            <div
              className="absolute left-[5%] bottom-[5%] w-[33%] h-[20%] flex items-center justify-center cursor-pointer hover:brightness-125 transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                onPickupItem?.("screwdriver", e);
                setTimeout(() => setPickedUp(true), 300);
              }}
            >
              <img
                src="https://i.postimg.cc/ZqRgWwW8/mbrg-swkb.png"
                className="w-full h-full object-contain drop-shadow-2xl"
                alt="Screwdriver"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>
    </CloseUpContainer>
  );
};

const BlankCanvas = ({
  onClose,
  selectedItem,
}: {
  onClose: () => void;
  selectedItem: string | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flashlightPos, setFlashlightPos] = useState({ x: -1000, y: -1000 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (selectedItem !== "uv-flashlight") return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setFlashlightPos({ x, y });
    }
  };

  const handlePointerLeave = () => {
    setFlashlightPos({ x: -1000, y: -1000 });
  };

  const maskX =
    flashlightPos.x === -1000 ? "-1000px" : `calc(100% - ${flashlightPos.x}px)`;
  const maskY = flashlightPos.y === -1000 ? "-1000px" : `${flashlightPos.y}px`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-0 overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-[200vw] md:w-[150vw] lg:w-[120vw] aspect-[4/3] relative flex items-center justify-center pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={containerRef}
          className={`w-full h-full relative shadow-2xl flex items-center justify-center pointer-events-auto ${selectedItem === "uv-flashlight" ? "cursor-none" : "cursor-pointer"}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerMove}
          style={{ touchAction: "none" }}
        >
          {/* Original canvas image, flipped to match scene */}
          <img
            src="https://i.postimg.cc/8C5fZGr4/qnbs-hds.png"
            className="absolute w-full h-full object-contain scale-x-[-1]"
            alt="Canvas"
            referrerPolicy="no-referrer"
          />

          {/* Hidden UV painting, masked by flashlight */}
          {selectedItem === "uv-flashlight" && flashlightPos.x !== -1000 && (
            <img
              src="https://i.postimg.cc/KYz30bgQ/qnbs-hds-_m-zywr.png"
              className="absolute inset-0 w-full h-full object-contain scale-x-[-1] pointer-events-none"
              alt="Canvas Secret"
              referrerPolicy="no-referrer"
              style={{
                WebkitMaskImage: `radial-gradient(circle clamp(120px, 20vw, 300px) at ${maskX} ${maskY}, black 20%, transparent 80%)`,
                maskImage: `radial-gradient(circle clamp(120px, 20vw, 300px) at ${maskX} ${maskY}, black 20%, transparent 80%)`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
              }}
            />
          )}

          {/* Visual flashlight beam overlay */}
          {selectedItem === "uv-flashlight" && flashlightPos.x !== -1000 && (
            <div
              className="absolute rounded-full pointer-events-none mix-blend-screen transition-opacity duration-150"
              style={{
                left: flashlightPos.x,
                top: flashlightPos.y,
                width: "clamp(240px, 40vw, 600px)",
                height: "clamp(240px, 40vw, 600px)",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(160,50,255,0.4) 0%, rgba(100,0,255,0) 70%)",
              }}
            />
          )}
        </div>
      </motion.div>
      <div className="absolute inset-0 pointer-events-none z-[1000]">
        <div className="pointer-events-auto">
          <ReturnButton
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const RugCorner = ({ onClose }: { onClose: () => void }) => {
  const [isLifted, setIsLifted] = useState(false);

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={4 / 3}>
      <div
        className="w-full h-full relative border-8 border-[#1a0a0a] bg-[#1a0a0a] shadow-2xl overflow-hidden cursor-pointer"
        onClick={() => setIsLifted(!isLifted)}
        style={{ perspective: "120cqw" }}
      >
        {/* Floor background */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#2a1414]">
          <img
            src="https://i.postimg.cc/x8H6rBXd/qwd-X-1.png"
            alt="Hidden Code"
            className="max-w-[60%] max-h-[60%] object-contain opacity-90"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Rug Corner (Clickable Area) */}
        <motion.div
          className="absolute inset-0 bg-[#5c2424] border-8 border-[#3a1414] shadow-2xl origin-top-right cursor-pointer rounded-bl-[100px]"
          onClick={() => setIsLifted(!isLifted)}
          animate={{
            rotateZ: isLifted ? -15 : 0,
            rotateX: isLifted ? 65 : 0,
            rotateY: isLifted ? 45 : 0,
            x: isLifted ? "15%" : "0%",
            y: isLifted ? "-15%" : "0%",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-4 border-4 border-[#8b3a3a]/30 rounded-bl-[80px]"></div>
        </motion.div>
      </div>
    </CloseUpContainer>
  );
};

const LoungeBookshelfCloseUp = ({
  onClose,
  onInspectLock,
  onPickupItem,
  hasItem,
  selectedItem,
}: {
  onClose: () => void;
  onInspectLock: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  selectedItem: string | null;
}) => {
  return (
    <CloseUpContainer onClose={onClose} aspectRatio={0.6}>
      <div className="w-full h-full bg-[#1a0a0a] border-8 border-[#2a0f0f] shadow-2xl flex flex-col justify-evenly p-6 relative">
        {/* Shelf 1 */}
        <div className="w-full h-[5%] bg-[#0a0505] relative shadow-md flex items-end justify-start px-4 gap-2">
          <div className="w-[5%] h-[400%] bg-[#5a3a3a] rounded-t-sm border-l-2 border-[#3a1a1a]"></div>
          <div className="w-[8%] h-[300%] bg-[#3a4a5a] rounded-t-sm border-l-2 border-[#1a2a3a]"></div>
          <div className="w-[5%] h-[400%] bg-[#3a5a3a] rounded-t-sm rotate-6 origin-bottom-left border-l-2 border-[#1a3a1a] ml-4"></div>
        </div>
        {/* Shelf 2 */}
        <div className="w-full h-[5%] bg-[#0a0505] relative shadow-md flex items-end justify-end px-4 gap-2">
          <div className="w-[10%] h-[350%] bg-[#4a3a5a] rounded-t-sm border-r-2 border-[#2a1a3a]"></div>
          <div className="w-[5%] h-[300%] bg-[#5a4a3a] rounded-t-sm border-r-2 border-[#3a2a1a]"></div>
        </div>
        {/* Shelf 3 */}
        <div className="w-full h-[5%] bg-[#0a0505] relative shadow-md flex items-end justify-start px-4 gap-2">
          <div className="w-[8%] h-[350%] bg-[#4a5a3a] rounded-t-sm border-l-2 border-[#2a3a1a]"></div>
          <div className="w-[5%] h-[400%] bg-[#5a3a3a] rounded-t-sm border-l-2 border-[#3a1a1a]"></div>
          <div className="w-[8%] h-[300%] bg-[#3a4a4a] rounded-t-sm border-l-2 border-[#1a2a2a]"></div>
        </div>
        {/* Shelf 4 (Bottom) */}
        <div className="w-full h-[5%] bg-[#0a0505] relative shadow-md flex justify-center">
          {/* Locked Box */}
          <div
            className="absolute bottom-[-7.5cqh] w-[10cqw] h-[10cqw] bg-[#3e2723] border-4 border-[#1b0000] rounded-md flex items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-lg"
            onClick={onInspectLock}
          >
            <div className="w-[40%] h-[50%] bg-yellow-600 rounded-sm border-2 border-yellow-800 flex items-center justify-center">
              <div className="w-[10%] h-[30%] bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const LoungeLockCloseUp = ({
  onClose,
  onUnlock,
  onPickupItem,
  hasItem,
  selectedItem,
  isUnlocked,
}: {
  onClose: () => void;
  onUnlock: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  selectedItem: string | null;
  isUnlocked: boolean;
}) => {
  const [row1Index, setRow1Index] = useState(2);
  const [row2Index, setRow2Index] = useState(2);
  const [row3Index, setRow3Index] = useState(2);

  const row1 = ["", "", "", "X", ""];
  const row2 = ["", "", "X", "", ""];
  const row3 = ["X", "", "", "", ""];

  const handleUnlock = () => {
    if (row1Index === 3 && row2Index === 1 && row3Index === 4) {
      onUnlock();
    } else {
      // No message
    }
  };

  const slideRow = (row: number, direction: "left" | "right") => {
    if (isUnlocked) return;
    if (row === 1) {
      setRow1Index((prev) =>
        direction === "left" ? Math.min(4, prev + 1) : Math.max(0, prev - 1),
      );
    } else if (row === 2) {
      setRow2Index((prev) =>
        direction === "left" ? Math.min(4, prev + 1) : Math.max(0, prev - 1),
      );
    } else if (row === 3) {
      setRow3Index((prev) =>
        direction === "left" ? Math.min(4, prev + 1) : Math.max(0, prev - 1),
      );
    }
  };

  const renderRow = (row: string[], currentIndex: number, rowNum: number) => (
    <div className="flex items-center gap-[5%] w-full justify-center h-[25%]">
      <button
        onClick={() => slideRow(rowNum, "right")}
        className="h-full aspect-square max-h-[60px] bg-[#4a4a4a] text-white rounded-[10%] flex items-center justify-center hover:bg-[#5a5a5a] active:bg-[#3a3a3a] disabled:opacity-50"
        disabled={currentIndex === 0 || isUnlocked}
      >
        <ChevronRight className="w-[50%] h-[50%]" />
      </button>

      <div
        className="h-full aspect-square bg-[#1a1a1a] border-[4px] border-[#5a5a5a] rounded-md overflow-hidden relative flex-shrink-0"
        dir="rtl"
      >
        <motion.div
          className="flex absolute top-0 right-0 h-full"
          animate={{ x: `${currentIndex * 20}%` }}
          style={{ width: "500%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {row.map((cell, idx) => (
            <div
              key={idx}
              className="w-1/5 h-full flex items-center justify-center border-l border-[#3a3a3a] last:border-l-0"
            >
              {cell === "X" && <X className="text-red-500 w-[50%] h-[50%]" />}
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={() => slideRow(rowNum, "left")}
        className="h-full aspect-square max-h-[60px] bg-[#4a4a4a] text-white rounded-[10%] flex items-center justify-center hover:bg-[#5a5a5a] active:bg-[#3a3a3a] disabled:opacity-50"
        disabled={currentIndex === 4 || isUnlocked}
      >
        <ChevronLeft className="w-[50%] h-[50%]" />
      </button>
    </div>
  );

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1}>
      <div
        className="w-full h-full bg-[#2a2a2a] border-[8px] border-[#1a1a1a] rounded-2xl shadow-2xl relative"
        style={{ perspective: "1000px" }}
      >
        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-[8px] border-t-[16px] border-[#111] z-0">
          {!hasItem("stop-sign") && (
            <div
              className="w-full h-full cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center p-[5%]"
              onClick={(e) => onPickupItem("stop-sign", e)}
            >
              <img
                src="https://i.postimg.cc/rpF1HxYf/_zwr.png"
                className="w-[80%] h-[80%] max-w-[250px] max-h-[250px] object-contain filter drop-shadow-md"
                alt="Stop Sign"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-[#2a2a2a] z-10 flex flex-col items-center justify-center p-[5%] gap-[5%] origin-top border-[8px] border-[#1a1a1a] rounded-2xl"
          animate={{ rotateX: isUnlocked ? 110 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex flex-col gap-[5%] w-[90%] h-[60%] items-center justify-center">
            {renderRow(row1, row1Index, 1)}
            {renderRow(row2, row2Index, 2)}
            {renderRow(row3, row3Index, 3)}
          </div>

          <button
            onClick={handleUnlock}
            className="h-[20%] aspect-square bg-yellow-700 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 active:bg-yellow-800 transition-colors border-[4px] border-yellow-900 shadow-lg"
          >
            <Unlock className="w-[40%] h-[40%]" />
          </button>

          {/* Back side of the door */}
          <div
            className="absolute inset-x-0 inset-y-0 bg-[#1a1a1a] border-[8px] border-[#111] rounded-2xl m-[-8px]"
            style={{
              transform: "rotateX(180deg) translateZ(1px)",
              backfaceVisibility: "hidden",
            }}
          ></div>
        </motion.div>
      </div>
    </CloseUpContainer>
  );
};

const PaintingCloseUp = ({
  onClose,
  onPickupItem,
  hasItem,
  selectedItem,
  screws,
  onRemoveScrew,
  isPaintingRemoved,
  onRemovePainting,
  isKeyPickedUp,
}: {
  onClose: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  selectedItem: string | null;
  screws: boolean[];
  onRemoveScrew: (index: number) => void;
  isPaintingRemoved: boolean;
  onRemovePainting: () => void;
  isKeyPickedUp: boolean;
}) => {
  const handleScrewClick = (index: number) => {
    if (selectedItem === "screwdriver") {
      onRemoveScrew(index);
    } else {
      // No message
    }
  };

  const handlePaintingClick = (e: React.MouseEvent) => {
    if (screws.some((s) => s)) {
      // No message
    } else {
      onPickupItem("family-picture", e);
      setTimeout(() => onRemovePainting(), 300);
    }
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1.25}>
      <div
        className="w-full h-full bg-[#1a0a0a] border-[#2a1414] rounded-sm shadow-2xl relative overflow-hidden flex items-center justify-center"
        style={{ borderWidth: "1cqw" }}
      >
        {/* Hidden Space / Safe - rendered first so it's behind */}
        <div className="absolute inset-x-[10%] inset-y-[10%] bg-[#0a0505] flex items-center justify-center rounded-sm">
          {!isKeyPickedUp && (
            <div
              className="w-[20cqw] h-[20cqw] cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 flex items-center justify-center"
              onClick={(e) => onPickupItem("bathroom-key", e)}
            >
              <img
                src="https://i.postimg.cc/MZ9kyCgs/מפתח_זהוב.png"
                className="w-full h-full object-contain"
                alt="מפתח זהוב"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Painting */}
        {!isPaintingRemoved && (
          <motion.div
            className="absolute inset-0 bg-[#3a1a1a] border-[#2a1414] shadow-2xl cursor-pointer flex items-center justify-center z-10 pointer-events-auto"
            onClick={handlePaintingClick}
            style={{
              borderWidth: "2cqw",
            }}
          >
            <div className="w-full h-full bg-[url('https://i.postimg.cc/0NtcD9N7/tmwnh-msphtyt.png')] bg-contain bg-no-repeat bg-center opacity-95"></div>

            {/* Screws on Frame */}
            <div className="absolute inset-0 pointer-events-none z-[100]">
              {/* Top Left */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: "-0.8cqw",
                  left: "-0.8cqw",
                  width: "3.6cqw",
                  height: "3.6cqw",
                }}
              >
                {screws[0] ? (
                  <div
                    className="w-full h-full bg-gray-300 rounded-full border-[0.4cqw] border-gray-500 flex items-center justify-center cursor-pointer hover:bg-white shadow-lg active:scale-90 transition-all relative overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrewClick(0);
                    }}
                  >
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 -rotate-45"></div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0, y: 0, opacity: 1 }}
                    animate={{ rotate: 720, y: "100cqh", opacity: 0 }}
                    transition={{ duration: 1, ease: "easeIn" }}
                    className="w-full h-full bg-gray-400 rounded-full border-[0.3cqw] border-gray-600 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 -rotate-45"></div>
                  </motion.div>
                )}
              </div>
              {/* Top Right */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: "-0.8cqw",
                  right: "-0.8cqw",
                  width: "3.6cqw",
                  height: "3.6cqw",
                }}
              >
                {screws[1] ? (
                  <div
                    className="w-full h-full bg-gray-300 rounded-full border-[0.4cqw] border-gray-500 flex items-center justify-center cursor-pointer hover:bg-white shadow-lg active:scale-90 transition-all relative overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrewClick(1);
                    }}
                  >
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 -rotate-45"></div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0, y: 0, opacity: 1 }}
                    animate={{ rotate: 720, y: "100cqh", opacity: 0 }}
                    transition={{ duration: 1, ease: "easeIn" }}
                    className="w-full h-full bg-gray-400 rounded-full border-[0.3cqw] border-gray-600 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 -rotate-45"></div>
                  </motion.div>
                )}
              </div>
              {/* Bottom Left */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  bottom: "-0.8cqw",
                  left: "-0.8cqw",
                  width: "3.6cqw",
                  height: "3.6cqw",
                }}
              >
                {screws[2] ? (
                  <div
                    className="w-full h-full bg-gray-300 rounded-full border-[0.4cqw] border-gray-500 flex items-center justify-center cursor-pointer hover:bg-white shadow-lg active:scale-90 transition-all relative overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrewClick(2);
                    }}
                  >
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 -rotate-45"></div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0, y: 0, opacity: 1 }}
                    animate={{ rotate: 720, y: "100cqh", opacity: 0 }}
                    transition={{ duration: 1, ease: "easeIn" }}
                    className="w-full h-full bg-gray-400 rounded-full border-[0.3cqw] border-gray-600 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 -rotate-45"></div>
                  </motion.div>
                )}
              </div>
              {/* Bottom Right */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  bottom: "-0.8cqw",
                  right: "-0.8cqw",
                  width: "3.6cqw",
                  height: "3.6cqw",
                }}
              >
                {screws[3] ? (
                  <div
                    className="w-full h-full bg-gray-300 rounded-full border-[0.4cqw] border-gray-500 flex items-center justify-center cursor-pointer hover:bg-white shadow-lg active:scale-90 transition-all relative overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrewClick(3);
                    }}
                  >
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[15%] bg-gray-600 -rotate-45"></div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0, y: 0, opacity: 1 }}
                    animate={{ rotate: 720, y: "100cqh", opacity: 0 }}
                    transition={{ duration: 1, ease: "easeIn" }}
                    className="w-full h-full bg-gray-400 rounded-full border-[0.3cqw] border-gray-600 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 rotate-45"></div>
                    <div className="absolute w-[60%] h-[12%] bg-gray-600 -rotate-45"></div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </CloseUpContainer>
  );
};

const LoungeMantleCloseUp = ({
  onClose,
  onPickupItem,
  hasItem,
}: {
  onClose: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
}) => {
  const [pickedUp, setPickedUp] = useState(false);
  const [stringPicked, setStringPicked] = useState(false);
  return (
    <CloseUpContainer onClose={onClose} aspectRatio={21 / 9}>
      <div className="w-full h-full bg-[#2a1414] border-8 border-[#1a0a0a] shadow-2xl flex items-end justify-center p-4 relative">
        {/* Mantle Surface */}
        <div className="absolute bottom-0 w-full h-[20%] bg-[#3a1a1a] border-t-4 border-[#4a2a2a]"></div>

        {/* Items on the mantle */}
        <div className="absolute inset-0 z-10 p-4">
          {!hasItem("remote") && !pickedUp && (
            <div
              className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[30%] h-[150%] cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 flex items-center justify-center transform -rotate-3"
              onClick={(e) => {
                e.stopPropagation();
                onPickupItem("remote", e);
                setTimeout(() => setPickedUp(true), 300);
              }}
            >
              <img
                src="https://i.postimg.cc/cC8QgYZW/slt.png"
                className="w-full h-full object-contain"
                alt="Remote"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {!hasItem("string") && !hasItem("hook-string") && !stringPicked && (
            <div
              className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[25%] h-[55%] cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onPickupItem("string", e);
                setTimeout(() => setStringPicked(true), 300);
              }}
            >
              <img
                src="https://i.postimg.cc/G3QRVN1c/hwt.png"
                className="w-full h-full object-contain"
                alt="חוט"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>
    </CloseUpContainer>
  );
};

const BathroomMirrorCloseUp = ({ onClose }: { onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [boxMoved, setBoxMoved] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 sm:p-8 pointer-events-auto"
    >
      <div className="w-full h-full relative flex items-center justify-center">
        {/* Wall Background */}
        <div className="absolute inset-0 bg-[#2b4a4a] border-8 border-[#1a2a2a] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#3d5c5c_0%,#1a2a2a_100%)] opacity-50"></div>
        </div>

        {/* Cabinet / Shelves Behind Mirror */}
        <div className="w-[40%] h-[70%] bg-[#1e272e] border-4 border-[#808e9b] rounded-t-full relative flex flex-col items-center pt-16 gap-8 shadow-inner z-10">
          <div className="w-[80%] h-2 bg-[#485460] rounded-sm shadow-sm relative">
            {/* Items on shelf 1 */}
            <div className="absolute bottom-full left-[10%] w-4 h-8 bg-[#ff6b6b] rounded-t-sm"></div>
            <div className="absolute bottom-full left-[30%] w-6 h-6 bg-[#4bcffa] rounded-full"></div>
          </div>
          <div className="w-[80%] h-2 bg-[#485460] rounded-sm shadow-sm relative">
            {/* Items on shelf 2 */}
            <div className="absolute bottom-full right-[20%] w-5 h-10 bg-[#0be881] rounded-t-md"></div>
          </div>
          <div className="w-[80%] h-2 bg-[#485460] rounded-sm shadow-sm relative">
            {/* Items on shelf 3 */}
            <div className="absolute bottom-full left-[40%] w-8 h-4 bg-[#ffd32a] rounded-sm"></div>
          </div>

          {/* Image and Box at the bottom of the cabinet */}
          <div className="mt-auto mb-0 w-[80%] h-20 relative flex items-end">
            <img
              src="https://i.postimg.cc/vT90RC4Z/qwd-X-2.png"
              alt="Clue"
              className="absolute left-0 bottom-0 w-20 h-auto object-contain"
              referrerPolicy="no-referrer"
            />

            {/* Box covering the image partially */}
            <motion.div
              className="absolute left-0 bottom-0 w-16 h-16 bg-[#8b5a2b] border-2 border-[#5c3a18] cursor-pointer z-10 flex items-center justify-center rounded-sm"
              animate={{ x: boxMoved ? 80 : 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              onClick={(e) => {
                e.stopPropagation();
                setBoxMoved(true);
              }}
            >
              {/* Box details */}
              <div className="w-full h-2 bg-[#704822] absolute top-2"></div>
              <div className="w-2 h-full bg-[#704822] absolute left-2"></div>
            </motion.div>
          </div>
        </div>

        {/* The Mirror Door */}
        <motion.div
          className="absolute w-[40%] h-[70%] border-4 border-[#808e9b] bg-[#d2dae2] rounded-t-full shadow-[0_0_30px_rgba(210,218,226,0.2)] origin-left cursor-pointer z-20 overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
          animate={{
            rotateY: isOpen ? -110 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent transform -rotate-45"></div>
          {/* Handle */}
          <div className="absolute top-1/2 right-2 w-2 h-8 bg-[#485460] rounded-full transform -translate-y-1/2"></div>
        </motion.div>
      </div>
      <ReturnButton onClick={onClose} />
    </motion.div>
  );
};

const ShowerDrainCloseUp = ({
  onClose,
  onMessage,
  selectedItem,
  onPickupItem,
  onRemoveItem,
  hasItem,
}: {
  onClose: () => void;
  onMessage: (msg: string) => void;
  selectedItem: string | null;
  onPickupItem: (item: string, e?: React.MouseEvent) => void;
  onRemoveItem: (item: string) => void;
  hasItem: (item: string) => boolean;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (hasItem("silver-key")) return;
    if (selectedItem === "hook-string") {
      // Find the key image div to apply animation specifically to it
      const keyImgContainer = e.currentTarget.querySelector(
        ".silver-key-pickup-target",
      ) as HTMLElement;
      if (keyImgContainer) {
        onPickupItem("silver-key", { ...e, currentTarget: keyImgContainer });
      } else {
        onPickupItem("silver-key");
      }
      onRemoveItem("hook-string");
    } else {
      onMessage("נראה שזה עמוק מידי");
    }
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1}>
      <div className="w-full h-full bg-[#d2dae2] flex items-center justify-center relative border-8 border-[#808e9b] shadow-inner">
        <div
          className="w-3/4 h-3/4 bg-[#1e272e] rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer hover:brightness-110 shadow-inner"
          onClick={handleClick}
        >
          {/* Silver key inside */}
          {!hasItem("silver-key") && (
            <div
              className="absolute w-16 h-16 z-0 rotate-45 opacity-60 silver-key-pickup-target"
              style={{ filter: "brightness(0.8)" }}
            >
              <img
                src="https://i.postimg.cc/MZ9kyCgd/מפתח_כסוף.png"
                className="w-full h-full object-contain"
                alt="מפתח כסוף"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Drain Grate */}
          <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none z-10">
            {[...Array(7)].map((_, i) => (
              <div key={`h-${i}`} className="w-full h-2 bg-[#485460]"></div>
            ))}
          </div>
          <div className="absolute inset-0 flex justify-evenly pointer-events-none z-10">
            {[...Array(7)].map((_, i) => (
              <div key={`v-${i}`} className="w-2 h-full bg-[#485460]"></div>
            ))}
          </div>

          {/* Outer Ring */}
          <div className="absolute inset-0 border-[16px] border-[#808e9b] rounded-full pointer-events-none z-20"></div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const PianoCloseUp = ({
  onClose,
  selectedItem,
  isSheetMusicPlaced,
  onPlaceSheetMusic,
  onSequenceComplete,
}: {
  onClose: () => void;
  selectedItem: string | null;
  isSheetMusicPlaced: boolean;
  onPlaceSheetMusic: () => void;
  onSequenceComplete: () => void;
}) => {
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);

  const playNote = (frequency: number, noteName: string) => {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 1.5,
    );
    oscillator.stop(audioCtx.currentTime + 1.5);

    setPlayedNotes((prev) => {
      const newSequence = [...prev, noteName].slice(-5);
      if (isSheetMusicPlaced && newSequence.join(" ") === "F4 G4 A4 D4 F4") {
        setTimeout(() => {
          onSequenceComplete();
        }, 500);
      }
      return newSequence;
    });
  };

  const whiteKeys = [
    { note: "C4", freq: 261.63 },
    { note: "D4", freq: 293.66 },
    { note: "E4", freq: 329.63 },
    { note: "F4", freq: 349.23 },
    { note: "G4", freq: 392.0 },
    { note: "A4", freq: 440.0 },
    { note: "B4", freq: 493.88 },
    { note: "C5", freq: 523.25 },
  ];

  const blackKeys = [
    { note: "Cs4", freq: 277.18, show: true },
    { note: "Ds4", freq: 311.13, show: true },
    { note: "none", freq: 0, show: false },
    { note: "Fs4", freq: 369.99, show: true },
    { note: "Gs4", freq: 415.3, show: true },
    { note: "As4", freq: 466.16, show: true },
    { note: "none", freq: 0, show: false },
    { note: "none", freq: 0, show: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 sm:p-8 pointer-events-auto"
    >
      <div className="w-full h-full relative border-8 border-[#1a1a1a] bg-[#0a0a0a] flex flex-col items-center justify-end pb-8 shadow-2xl">
        {/* Sheet Music Stand */}
        <div
          className={`absolute top-[10%] w-[60%] h-[40%] border-4 border-[#222] bg-[#111] flex flex-col items-center justify-center shadow-inner ${selectedItem === "sheet-music" && !isSheetMusicPlaced ? "cursor-pointer hover:brightness-110" : ""}`}
          onClick={() => {
            if (selectedItem === "sheet-music" && !isSheetMusicPlaced) {
              onPlaceSheetMusic();
            }
          }}
        >
          {isSheetMusicPlaced ? (
            <img
              src="https://i.postimg.cc/h4xJxzRJ/twwym.png"
              className="absolute bottom-[-4px] w-[110%] h-[120%] object-contain drop-shadow-xl z-10 pointer-events-none origin-bottom"
              alt="Sheet Music"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
              <div className="w-[60%] h-[2px] bg-white mt-4"></div>
              <div className="w-[60%] h-[2px] bg-white mt-2"></div>
              <div className="w-[60%] h-[2px] bg-white mt-2"></div>
            </div>
          )}
          <div className="absolute bottom-[-4px] w-[110%] h-4 bg-[#222] border-t-2 border-[#333] shadow-lg z-20"></div>
        </div>

        {/* Keys (One Octave + C) */}
        <div
          className="w-[80%] h-[30%] bg-white border-4 border-[#111] flex relative shadow-xl rounded-b-md"
          dir="ltr"
        >
          {/* White Keys */}
          {whiteKeys.map((key, i) => (
            <div
              key={`w-${i}`}
              onClick={() => playNote(key.freq, key.note)}
              className="flex-1 border-r-2 border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors rounded-b-sm active:bg-gray-200"
            ></div>
          ))}
          {/* Black Keys */}
          <div className="absolute top-0 left-0 w-full h-[60%] flex pointer-events-none">
            {blackKeys.map((key, i) => (
              <div key={`b-${i}`} className="flex-1 relative">
                {key.show && (
                  <div
                    onClick={() => playNote(key.freq, key.note)}
                    className="absolute top-0 left-full -translate-x-1/2 w-[60%] h-full bg-black z-10 rounded-b-md shadow-md pointer-events-auto hover:bg-gray-800 cursor-pointer active:bg-gray-900"
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReturnButton onClick={onClose} />
    </motion.div>
  );
};

const TopTextMessage = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="absolute top-[5%] left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-[2cqw] py-[0.6cqw] z-[1000] shadow-lg pointer-events-none flex items-center gap-[1.5cqw]"
    >
      {text.startsWith("✓ ") && (
        <div className="w-[3.5cqw] h-[3.5cqw] bg-[#1a3a1f] rounded-full flex items-center justify-center border border-[#2d5a35]/30 shadow-[0_0_8px_rgba(26,58,31,0.6)]">
          <Check className="text-white/90 w-[70%] h-[70%]" strokeWidth={2.5} />
        </div>
      )}
      <div className="text-white text-[2cqw] font-normal text-center tracking-widest whitespace-nowrap">
        {text.startsWith("✓ ") ? text.substring(2) : text}
      </div>
    </motion.div>
  );
};

const SpeechBubble = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-[4cqw] shadow-2xl z-[1000] pointer-events-auto"
    >
      <div className="max-w-[90%] mx-auto">
        <p className="text-white text-[3.5cqw] text-right font-light tracking-wide leading-relaxed">
          <TypewriterText
            text={text}
            onComplete={() => setTimeout(onComplete, 2500)}
          />
        </p>
      </div>
    </motion.div>
  );
};

const ItemDisplay = ({
  item,
  onClose,
  selectedItem,
  onCombine,
  onInventoryToggle,
  onTransform,
  onClickCandle,
  isVaseBroken,
  onSetVaseBroken,
}: {
  item: string;
  onClose: () => void;
  selectedItem?: string | null;
  onCombine?: (item1: string, item2: string) => void;
  onInventoryToggle: (open: boolean) => void;
  onTransform?: (oldItem: string, newItem: string) => void;
  onClickCandle?: () => void;
  isVaseBroken: boolean;
  onSetVaseBroken: (b: boolean) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const getItemName = (id: string) => {
    return ITEM_NAMES[id] || id;
  };
  const setIsVaseBroken = onSetVaseBroken;

  const handleItemClick = (e: React.MouseEvent) => {
    let combined = false;
    if (item === "hook" && selectedItem === "string" && onCombine) {
      onCombine("hook", "string");
      combined = true;
    } else if (item === "string" && selectedItem === "hook" && onCombine) {
      onCombine("string", "hook");
      combined = true;
    }

    if (combined) {
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto cursor-pointer"
      onClick={() => {
        if (item === "vase" && isVaseBroken) return;
        onClose();
        onInventoryToggle(false);
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`absolute ${item === "recipe-book" ? "top-[5cqh]" : "top-[10cqh]"} w-full max-w-[90vw] text-center text-white/80 text-[3.5cqw] md:text-[2.2cqw] font-bold tracking-widest break-words`}
        >
          {item === "vase" && isVaseBroken ? "אגרטל שבור" : getItemName(item)}
        </div>

        <div className="relative flex items-center justify-center w-full h-[60cqh] pointer-events-auto cursor-default">
          {item === "family-picture" && (
            <div
              className="w-[30cqw] h-[22.5cqw] flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              style={{ perspective: "100cqw" }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src="https://i.postimg.cc/0NtcD9N7/tmwnh-msphtyt.png"
                    alt="Family Picture Front"
                    className="max-w-full max-h-full object-contain rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <img
                    src="https://i.postimg.cc/fWYqgn2P/tmwnh-msphtyt-zd-sny.png"
                    alt="Family Picture Back"
                    className="max-w-full max-h-full object-contain rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>
          )}
          {item === "screwdriver" && (
            <div className="w-[30cqw] h-[30cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/FsDNPf8N/מברג_על_הצד.png"
                className="w-full h-full object-contain"
                alt="Screwdriver"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "fuse" && (
            <div className="w-[24cqw] aspect-[5/2] border-[0.2cqw] border-[#4a5560] bg-[#2c343b] flex items-center justify-between px-[5%] shadow-inner rounded-[1cqw]">
              <div className="w-[60%] h-[20%] bg-[#cbd5e1] rounded-sm"></div>
              <div className="w-[20%] aspect-square max-h-[80%] rounded-full bg-[#ff4a4a] shadow-[0_0_20px_#ff4a4a] flex-shrink-0"></div>
            </div>
          )}
          {item === "remote" && (
            <div className="w-[30cqw] h-[30cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/cC8QgYZW/slt.png"
                className="w-full h-full object-contain"
                alt="Remote"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "bathroom-key" && (
            <div className="w-[30cqw] h-[30cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/MZ9kyCgs/מפתח_זהוב.png"
                className="w-full h-full object-contain"
                alt="מפתח זהוב"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "silver-key" && (
            <div className="w-[30cqw] h-[30cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/MZ9kyCgd/מפתח_כסוף.png"
                className="w-full h-full object-contain"
                alt="מפתח כסוף"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "string" && (
            <div
              className={`w-[30cqw] h-[30cqw] flex items-center justify-center cursor-pointer ${selectedItem === "hook" ? "hover:scale-110" : ""}`}
              onClick={handleItemClick}
            >
              <img
                src="https://i.postimg.cc/G3QRVN1c/hwt.png"
                className="w-full h-full object-contain"
                alt="חוט"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "hook" && (
            <div
              className={`w-[30cqw] h-[30cqw] flex items-center justify-center cursor-pointer ${selectedItem === "string" ? "hover:scale-110" : ""}`}
              onClick={handleItemClick}
            >
              <img
                src="https://i.postimg.cc/zDxmns4n/הוק.png"
                className="w-full h-full object-contain"
                alt="וו"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "hook-string" && (
            <div className="w-[30cqw] h-[30cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/bwkLybh3/hwt-whwq.png"
                className="w-full h-full object-contain"
                alt="חוט עם וו"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "recipe-book" && (
            <div
              className="w-[40cqw] h-[40cqw] flex flex-col items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPage((prev) => (prev === 3 ? 0 : prev + 1));
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {currentPage === 0 && (
                  <img
                    src="https://i.postimg.cc/T2L7WNRK/ywmn.png"
                    className="max-w-full max-h-full object-contain"
                    alt="Diary"
                    referrerPolicy="no-referrer"
                  />
                )}
                {currentPage === 1 && (
                  <img
                    src="https://i.postimg.cc/BQM4h8kG/יומן_פתוח_1.png"
                    className="max-w-full max-h-full object-contain"
                    alt="Page 1"
                    referrerPolicy="no-referrer"
                  />
                )}
                {currentPage === 2 && (
                  <img
                    src="https://i.postimg.cc/bN3p6GWz/יומן_פתוח_2.png"
                    className="max-w-full max-h-full object-contain"
                    alt="Page 2"
                    referrerPolicy="no-referrer"
                  />
                )}
                {currentPage === 3 && (
                  <img
                    src="https://i.postimg.cc/8PtNyF9k/יומן_פתוח_3.png"
                    className="max-w-full max-h-full object-contain"
                    alt="Page 3"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          )}
          {item === "pan" && (
            <div className="w-[40cqw] h-[32cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/6qjzxXhM/mhbt.png"
                className="w-full h-full object-contain"
                alt="Pan"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "pasta" && (
            <div className="w-[25cqw] h-[32cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/NFXHdL15/פסטה.png"
                className="w-full h-full object-contain"
                alt="Pasta"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "cream" && (
            <div className="w-[25cqw] h-[32cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/vTnV0DW4/שמנת.png"
                className="w-full h-full object-contain"
                alt="Cream"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "milk" && (
            <div className="w-[25cqw] h-[32cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/QC7TfVpd/חלב.png"
                className="w-full h-full object-contain"
                alt="Milk"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "eggs" && (
            <div className="w-[32cqw] h-[25cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/4yc9Wnzf/ביצים.png"
                className="w-full h-full object-contain"
                alt="Eggs"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "chicken" && (
            <div className="w-[32cqw] h-[25cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/ZnNdw0r0/עוף.png"
                className="w-full h-full object-contain"
                alt="Chicken"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "tomato-sauce" && (
            <div className="w-[15cqw] h-[25cqw] bg-red-600 border-4 border-red-800 rounded-xl flex flex-col items-center justify-center relative">
              <div className="w-full h-[6cqh] bg-white absolute top-[20%] flex items-center justify-center">
                <div className="w-3/4 h-1 bg-red-600/20"></div>
              </div>
              <div className="w-[5cqw] h-[5cqw] bg-green-800 rounded-full absolute -top-[10%] border-2 border-green-900"></div>
            </div>
          )}
          {item === "blue-paint" && (
            <div className="w-[33.75cqw] h-[33.75cqw] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-end justify-center pointer-events-none">
              <img
                src="https://i.postimg.cc/MGTsv6w2/dly-zb_-khwl-sgwr.png"
                alt="Blue Paint"
                className="w-full h-full object-contain filter drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "ladder" && (
            <div className="w-[55cqw] h-[55cqh] flex items-center justify-center mt-[4cqh]">
              <img
                src="https://i.postimg.cc/wj91CGvB/swlm.png"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                alt="Ladder"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "pot" && (
            <div className="w-[40cqw] h-[40cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/9097LzG0/syr.png"
                className="w-full h-full object-contain"
                alt="Pot"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "folded-paper" && (
            <div
              className="w-[30cqw] h-[30cqw] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onTransform?.("folded-paper", "recipe");
              }}
            >
              <img
                src="https://i.postimg.cc/Twt6BccG/mtkwn-mqwpl.png"
                className="w-full h-full object-contain drop-shadow-xl"
                alt="Folded paper"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "recipe" && (
            <div className="w-[35cqw] h-[35cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/zBxr4kkm/mtkwn-lpsth.png"
                className="w-full h-full object-contain drop-shadow-xl"
                alt="Recipe"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "ready-pasta" && (
            <div className="w-[40cqw] h-[40cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/wTdy6qXP/syr-_m-psth-wsmnt.png"
                className="w-full h-full object-contain"
                alt="Ready Pasta"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "stop-sign" && (
            <div
              className="w-[35cqw] h-[35cqw] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
              onClick={(e) => {
                let combined = false;
                if (selectedItem === "stick" && onCombine) {
                  onCombine("stop-sign", "stick");
                  combined = true;
                }
                if (combined) e.stopPropagation();
              }}
            >
              <img
                src="https://i.postimg.cc/rpF1HxYf/_zwr.png"
                className="w-[90%] h-[90%] object-contain"
                alt="Stop Sign"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "car-keys" && (
            <div className="w-[20cqw] h-[20cqw] flex items-center justify-center drop-shadow-xl">
              <img
                src="https://i.postimg.cc/3xZj9n9f/mpthwt-rkb.png"
                className="w-[90%] h-[90%] object-contain"
                alt="Car Keys"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "bedroom-key" && (
            <div className="w-[32cqw] h-[32cqw] flex items-center justify-center drop-shadow-xl">
              <img
                src="https://i.postimg.cc/7LR7CWV0/Gemini-Generated-Image-vxrym3vxrym3vxry-removebg-preview.png"
                className="w-full h-full object-contain"
                alt="Bedroom Key"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "vase" && !isVaseBroken && (
            <div className="relative flex w-full h-full items-center justify-center">
              <div className="relative w-[25cqw] h-[25cqw] flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/RZ31sMm9/kd.png"
                  className="w-[90%] h-[90%] object-contain drop-shadow-xl"
                  alt="Vase"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute right-[-15cqw] sm:right-[-12cqw] top-1/2 -translate-y-1/2">
                  <button
                    type="button"
                    className="px-[4cqw] py-[1.5cqh] bg-red-600/90 text-white font-bold rounded-lg border-2 border-red-700/50 hover:bg-red-500 hover:border-red-600 transition-all shadow-[0_4px_12px_rgba(220,38,38,0.4)] text-[2.5cqw] sm:text-[1.8cqw] cursor-pointer hover:scale-105 active:scale-95 duration-150 z-10 pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVaseBroken(true);
                    }}
                  >
                    לשבור
                  </button>
                </div>
              </div>
            </div>
          )}
          {item === "vase" && isVaseBroken && (
            <div className="w-[40cqw] h-[40cqw] flex items-center justify-center relative">
              {/* Broken Vase Image */}
              <img
                src="https://i.postimg.cc/vZ17qQyb/kd-sbwr.png"
                className="w-full h-full object-contain drop-shadow-2xl"
                alt="Broken Vase"
                referrerPolicy="no-referrer"
              />

              {/* Candle Image placed in the absolute center of the broken vase */}
              <div className="absolute inset-[15%] flex items-center justify-center">
                <div
                  className="w-[12cqw] h-[12cqw] cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-100 flex items-center justify-center z-10 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClickCandle) {
                      onClickCandle();
                    }
                  }}
                >
                  <img
                    src="https://i.postimg.cc/TYB5PgzB/nr-kbwy.png"
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(253,224,71,0.8)]"
                    alt="Candle"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          )}
          {item === "broom" && (
            <div className="w-[80cqw] h-[80cqw] max-h-[70vh] max-w-[70vh] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/vZv7X3XP/mt_t_.png"
                className="w-full h-full object-contain drop-shadow-xl rotate-90 scale-[1.3] md:scale-[1.5]"
                alt="Broom"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "broken-broom" && (
            <div
              className="w-[45cqw] h-[60cqh] flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                if (onTransform) onTransform("broken-broom", "stick");
              }}
            >
              <img
                src="https://i.postimg.cc/DwcQ5B5j/mt_t_-sbwr.png"
                className="w-[100%] h-[100%] max-w-full max-h-full object-contain drop-shadow-xl"
                alt="Broken Broom"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "stick" && (
            <div
              className="w-[45cqw] h-[60cqh] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
              onClick={(e) => {
                let combined = false;
                if (selectedItem === "stop-sign" && onCombine) {
                  onCombine("stick", "stop-sign");
                  combined = true;
                }
                if (combined) e.stopPropagation();
              }}
            >
              <img
                src="https://i.postimg.cc/8zbdwtwZ/mql.png"
                className="w-[100%] h-[100%] max-w-full max-h-full object-contain drop-shadow-xl"
                alt="Stick"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "stick-stop-sign" && (
            <div className="w-[45cqw] h-[60cqh] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/d0t2frS4/_zwr-_l-mql.png"
                className="w-[100%] h-[100%] max-w-full max-h-full object-contain drop-shadow-xl"
                alt="Stick with Stop Sign"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "uv-flashlight" && (
            <div className="w-[45cqw] h-[60cqh] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/QMC3MQCc/pns-_wltrh-sgwl.png"
                className="w-[100%] h-[100%] max-w-full max-h-full object-contain drop-shadow-xl"
                alt="UV Flashlight"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "sheet-music" && (
            <div className="w-[45cqw] h-[60cqh] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/h4xJxzRJ/twwym.png"
                className="w-[100%] h-[100%] max-w-full max-h-full object-contain drop-shadow-xl"
                alt="Sheet Music"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "gloves" && (
            <div className="w-[35cqw] h-[35cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/HnvWMWfF/kppwt-nyqwy.png"
                className="w-[250%] h-[250%] object-contain drop-shadow-xl"
                alt="Gloves"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "candle" && (
            <div className="w-[45cqw] h-[45cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/TYB5PgzB/nr-kbwy.png"
                className="w-[80%] h-[80%] object-contain drop-shadow-xl"
                alt="Candle"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          {item === "lit-candle" && (
            <div className="w-[45cqw] h-[45cqw] flex items-center justify-center">
              <img
                src="https://i.postimg.cc/Hs7pRbXn/nr.png"
                className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_40px_rgba(255,160,0,0.8)]"
                alt="Lit Candle"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>
      {!(item === "vase" && isVaseBroken) && (
        <div className="absolute bottom-[4cqh] left-[4cqw]">
          <ReturnButton
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

const InventoryToolbar = ({
  isOpen,
  onToggle,
  items,
  selectedItem,
  displayItem,
  onSelectItem,
  onInspectItem,
  isInventoryPulsing,
  setShowCandleReveal,
}: {
  isOpen: boolean;
  onToggle: () => void;
  items: string[];
  selectedItem: string | null;
  displayItem: string | null;
  onSelectItem: (item: string | null) => void;
  onInspectItem: (item: string | null) => void;
  isInventoryPulsing: boolean;
  setShowCandleReveal: (b: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  const updateConstraints = () => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      if (contentWidth > containerWidth) {
        // In RTL, we start at 0 (right side) and drag right (positive) to see left items
        // We stop exactly when the last item reaches the edge
        setDragConstraints({ left: 0, right: contentWidth - containerWidth });
      } else {
        setDragConstraints({ left: 0, right: 0 });
      }
    }
  };

  useEffect(() => {
    updateConstraints();
    // Small timeout to measure after the opening animation completes
    const timer = setTimeout(updateConstraints, 350);
    return () => clearTimeout(timer);
  }, [items, isOpen]);

  const getItemName = (item: string) => {
    return ITEM_NAMES[item] || item;
  };

  return (
    <div className="absolute bottom-6 right-6 z-[200] flex items-center gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col bg-[#1a1c20] border-2 border-[#3a3f47] rounded-[2rem] shadow-xl relative"
            style={{
              originX: 1,
              maxWidth: "min(500px, 75vw)",
              width: "max-content",
            }}
          >
            <div
              ref={containerRef}
              className="flex items-center p-2 no-scrollbar rounded-[2rem] overflow-x-hidden max-w-full"
              style={{ clipPath: "inset(-50px 0px -50px 0px)" }}
              dir="rtl"
            >
              <motion.div
                key={items.length + "-" + isOpen}
                ref={contentRef}
                drag={dragConstraints.right > 0 ? "x" : false}
                dragConstraints={dragConstraints}
                dragElastic={0}
                onDragStart={updateConstraints}
                className="flex items-center gap-2 px-1 w-max relative"
              >
                {items.length === 0 ? (
                  <div className="text-gray-500 tracking-widest text-sm px-4 whitespace-nowrap">
                    ריק
                  </div>
                ) : (
                  items.map((item, i) => (
                    <div
                      key={i}
                      className="relative flex flex-col items-center shrink-0 group"
                    >
                      <AnimatePresence>
                        {selectedItem === item &&
                          item !== "candle" &&
                          item !== "lit-candle" && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 2 }}
                              className="absolute bottom-[110%] w-max max-w-[100px] left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-center text-center"
                            >
                              <span className="text-white text-[13px] tracking-widest font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] px-1 py-0.5 leading-tight whitespace-normal">
                                {getItemName(item)}
                              </span>
                            </motion.div>
                          )}
                      </AnimatePresence>
                      <div
                        className={`w-12 h-12 border-2 ${selectedItem === item ? "border-white bg-[#3a3f47]" : "border-[#3a3f47] bg-[#2a2d34]"} flex items-center justify-center rounded-full shadow-inner cursor-pointer hover:bg-[#3a3f47] transition-colors relative z-10`}
                        onDoubleClick={() => {
                          // No special action (standard onClick handles inspection)
                        }}
                        onClick={() => {
                          if (selectedItem === item) {
                            if (displayItem === item) {
                              // Third click: Deselect and close display
                              onSelectItem(null);
                              onInspectItem(null);
                            } else {
                              // Second click: Display item
                              onInspectItem(item);
                            }
                          } else {
                            // First click: Select item (show name)
                            onSelectItem(item);
                          }
                        }}
                      >
                        {item === "screwdriver" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/FsDNPf8N/מברג_על_הצד.png"
                              className="w-full h-full object-contain"
                              alt="Screwdriver"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "candle" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/TYB5PgzB/nr-kbwy.png"
                              className="w-[110%] h-[110%] object-contain -translate-y-1"
                              alt="Candle"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "lit-candle" && (
                          <div className="w-8 h-10 flex items-center justify-center relative">
                            <div className="absolute top-0 w-2 h-2 bg-orange-500 blur-sm rounded-full mix-blend-screen opacity-80"></div>
                            <img
                              src="https://i.postimg.cc/Hs7pRbXn/nr.png"
                              className="w-[110%] h-[110%] object-contain -translate-y-1 drop-shadow-[0_0_10px_rgba(255,160,0,0.8)]"
                              alt="Lit Candle"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "fuse" && (
                          <div className="w-[64%] aspect-[5/2] max-w-6 border border-[#4a5560] bg-[#2c343b] flex items-center justify-between px-[5%] shadow-inner mx-auto rounded-[2px]">
                            <div className="w-[60%] h-[20%] bg-[#cbd5e1] rounded-sm"></div>
                            <div className="w-[20%] aspect-square max-h-[80%] rounded-full bg-[#ff4a4a] shadow-[0_0_20px_#ff4a4a] flex-shrink-0"></div>
                          </div>
                        )}
                        {item === "remote" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/cC8QgYZW/slt.png"
                              className="w-full h-full object-contain"
                              alt="Remote"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "recipe-book" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/T2L7WNRK/ywmn.png"
                              className="w-full h-full object-contain"
                              alt="Diary"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "pot" && (
                          <div className="w-[6cqw] h-[6cqw] flex items-center justify-center max-w-[40px] max-h-[40px]">
                            <img
                              src="https://i.postimg.cc/9097LzG0/syr.png"
                              className="w-full h-full object-contain"
                              alt="Pot"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "cream" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/vTnV0DW4/שמנת.png"
                              className="w-full h-full object-contain"
                              alt="Cream"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "milk" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/QC7TfVpd/חלב.png"
                              className="w-full h-full object-contain"
                              alt="Milk"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "eggs" && (
                          <div className="w-10 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/4yc9Wnzf/ביצים.png"
                              className="w-full h-full object-contain"
                              alt="Eggs"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "chicken" && (
                          <div className="w-10 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/ZnNdw0r0/עוף.png"
                              className="w-full h-full object-contain"
                              alt="Chicken"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "pasta" && (
                          <div className="w-8 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/NFXHdL15/פסטה.png"
                              className="w-full h-full object-contain"
                              alt="Pasta"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "pan" && (
                          <div className="w-10 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/6qjzxXhM/mhbt.png"
                              className="w-full h-full object-contain"
                              alt="Pan"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "stop-sign" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/rpF1HxYf/_zwr.png"
                              className="w-full h-full object-contain"
                              alt="Stop Sign"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "car-keys" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/3xZj9n9f/mpthwt-rkb.png"
                              className="w-full h-full object-contain"
                              alt="Car Keys"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "bedroom-key" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/7LR7CWV0/Gemini-Generated-Image-vxrym3vxrym3vxry-removebg-preview.png"
                              className="w-full h-full object-contain"
                              alt="Bedroom Key"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "vase" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/RZ31sMm9/kd.png"
                              className="w-full h-full object-contain"
                              alt="Vase"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "broom" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/vZv7X3XP/mt_t_.png"
                              className="w-full h-full object-contain"
                              alt="Broom"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "broken-broom" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/DwcQ5B5j/mt_t_-sbwr.png"
                              className="w-[130%] h-[130%] object-contain"
                              alt="Broken Broom"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "gloves" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/HnvWMWfF/kppwt-nyqwy.png"
                              className="w-[130%] h-[130%] object-contain"
                              alt="Gloves"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "hook" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/zDxmns4n/הוק.png"
                              className="w-full h-full object-contain"
                              alt="וו"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "string" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/G3QRVN1c/hwt.png"
                              className="w-full h-full object-contain"
                              alt="חוט"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "hook-string" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/bwkLybh3/hwt-whwq.png"
                              className="w-full h-full object-contain"
                              alt="חוט עם וו"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "family-picture" && (
                          <div className="w-8 h-6 border border-[#2a1414] shadow-sm overflow-hidden">
                            <img
                              src="https://i.postimg.cc/0NtcD9N7/tmwnh-msphtyt.png"
                              alt="Family Picture"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "bathroom-key" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/MZ9kyCgs/מפתח_זהוב.png"
                              className="w-full h-full object-contain"
                              alt="מפתח זהוב"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "silver-key" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/MZ9kyCgd/מפתח_כסוף.png"
                              className="w-full h-full object-contain"
                              alt="מפתח כסוף"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "ladder" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/wj91CGvB/swlm.png"
                              className="w-full h-full object-contain"
                              alt="Ladder"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "folded-paper" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/Twt6BccG/mtkwn-mqwpl.png"
                              className="w-full h-full object-contain"
                              alt="Folded Paper"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "recipe" && (
                          <div className="w-8 h-8 flex items-center justify-center rotate-[15deg]">
                            <img
                              src="https://i.postimg.cc/zBxr4kkm/mtkwn-lpsth.png"
                              className="w-full h-full object-contain"
                              alt="Recipe"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "ready-pasta" && (
                          <div className="w-[8cqw] h-[8cqw] flex items-center justify-center max-w-[48px] max-h-[48px]">
                            <img
                              src="https://i.postimg.cc/wTdy6qXP/syr-_m-psth-wsmnt.png"
                              className="w-full h-full object-contain"
                              alt="Ready Pasta"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "blue-paint" && (
                          <div className="h-10 w-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/MGTsv6w2/dly-zb_-khwl-sgwr.png"
                              className="max-w-full max-h-full object-contain filter drop-shadow-md"
                              alt="Blue Paint"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "tomato-sauce" && (
                          <div className="w-6 h-10 bg-red-600 border border-red-800 rounded-sm relative">
                            <div className="w-full h-2 bg-white absolute top-2"></div>
                          </div>
                        )}
                        {item === "stick" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/8zbdwtwZ/mql.png"
                              className="w-[120%] h-[120%] object-contain"
                              alt="Stick"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "stick-stop-sign" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/d0t2frS4/_zwr-_l-mql.png"
                              className="w-[120%] h-[120%] object-contain"
                              alt="Stick with Stop Sign"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "uv-flashlight" && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/QMC3MQCc/pns-_wltrh-sgwl.png"
                              className="w-[150%] h-[150%] object-contain"
                              alt="UV Flashlight"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item === "sheet-music" && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/h4xJxzRJ/twwym.png"
                              className="w-[120%] h-[120%] object-contain"
                              alt="Sheet Music"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {item !== "screwdriver" &&
                          item !== "fuse" &&
                          item !== "remote" &&
                          item !== "recipe-book" &&
                          item !== "pasta" &&
                          item !== "cream" &&
                          item !== "milk" &&
                          item !== "eggs" &&
                          item !== "chicken" &&
                          item !== "pan" &&
                          item !== "family-picture" &&
                          item !== "bathroom-key" &&
                          item !== "silver-key" &&
                          item !== "blue-paint" &&
                          item !== "tomato-sauce" &&
                          item !== "pot" &&
                          item !== "string" &&
                          item !== "hook" &&
                          item !== "hook-string" &&
                          item !== "ladder" &&
                          item !== "folded-paper" &&
                          item !== "recipe" &&
                          item !== "ready-pasta" &&
                          item !== "stop-sign" &&
                          item !== "car-keys" &&
                          item !== "bedroom-key" &&
                          item !== "vase" &&
                          item !== "broom" &&
                          item !== "broken-broom" &&
                          item !== "gloves" &&
                          item !== "stick" &&
                          item !== "stick-stop-sign" &&
                          item !== "uv-flashlight" &&
                          item !== "sheet-music" &&
                          item !== "candle" &&
                          item !== "lit-candle" && (
                            <span className="text-[10px] text-center text-gray-300">
                              {item}
                            </span>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onToggle}
        className={`p-3 sm:p-4 border-2 border-[#3a3f47] transition-all rounded-full shadow-xl z-10 ${isOpen ? "bg-[#2a2d34] text-white" : "bg-[#1a1c20] text-gray-300 hover:bg-[#2a2d34] hover:text-white"}`}
        style={{
          transform: isInventoryPulsing ? "scale(1.2)" : "scale(1)",
        }}
      >
        {isOpen ? (
          <X size={24} className="sm:w-7 sm:h-7" />
        ) : (
          <Briefcase size={24} className="sm:w-7 sm:h-7" />
        )}
      </button>
    </div>
  );
};

const StudioBoxCloseUp = ({
  onClose,
  selectedItem,
  onPickupItem,
  hasItem,
  isUnlocked,
  onUnlock,
}: {
  onClose: () => void;
  selectedItem: string | null;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  isUnlocked: boolean;
  onUnlock: () => void;
}) => {
  const [isPickedUp, setIsPickedUp] = useState(false);

  const handleUnlock = () => {
    if (selectedItem === "silver-key") {
      onUnlock();
    }
  };

  const handlePickup = (e: React.MouseEvent) => {
    if (!isPickedUp) {
      onPickupItem("sheet-music", e);
      setTimeout(() => setIsPickedUp(true), 300);
    }
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1}>
      <div className="w-[60%] h-[60%] bg-[#3e2723] border-[0.5cqw] border-[#1a0a0a] rounded-[1cqw] shadow-2xl relative">
        <div className="absolute inset-0" style={{ perspective: "1000px" }}>
          {/* Box Interior / Content */}
          <div className="absolute inset-0 bg-[#2a1414] rounded-[1cqw] flex flex-col items-center justify-center border-[0.2cqw] border-[#1a0a0a] shadow-inner p-[2cqw] z-0">
            {!isPickedUp && !hasItem("sheet-music") && (
              <div
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                onClick={handlePickup}
              >
                <img
                  src="https://i.postimg.cc/h4xJxzRJ/twwym.png"
                  className="w-[80%] h-auto object-contain drop-shadow-md"
                  alt="Sheet Music"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Lid Animation */}
          <motion.div
            className="absolute inset-0 bg-[#4e342e] border-[0.5cqw] border-[#1a0a0a] rounded-[1cqw] z-10 flex flex-col items-center justify-center shadow-lg origin-left"
            animate={{ rotateY: isUnlocked ? -110 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="w-[6cqw] h-[9cqw] bg-gray-300 rounded-lg border-[0.2cqw] border-gray-500 flex flex-col items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-lg absolute inset-0 m-auto"
              onClick={handleUnlock}
            >
              <div className="w-[1.2cqw] h-[1.2cqw] bg-black rounded-full mb-1"></div>
              <div className="w-[0.6cqw] h-[2cqw] bg-black -mt-[0.2cqw]"></div>
            </div>

            {/* Back side of the door */}
            <div
              className="absolute inset-0 bg-[#3a201a] border-[0.5cqw] border-[#1a0a0a] rounded-[1cqw]"
              style={{
                transform: "rotateY(180deg) translateZ(1px)",
                backfaceVisibility: "hidden",
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    </CloseUpContainer>
  );
};

const SwitchesBoxCloseUp = ({
  onClose,
  switchesState,
  onSwitchToggle,
  onPullHandle,
}: {
  onClose: () => void;
  switchesState: boolean[];
  onSwitchToggle: (idx: number) => void;
  onPullHandle: () => boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1.3}>
      <div
        className="w-full h-full bg-[#333] border-[1.5cqw] border-[#1a1c20] shadow-2xl relative overflow-hidden flex"
        style={{ perspective: "800px" }}
      >
        {/* The Open Door Layer (Top) */}
        <motion.div
          className="absolute inset-0 z-50 bg-[#2c343b] border-[1.5cqw] border-[#1a1c20] cursor-pointer flex items-center justify-center group shadow-2xl origin-left"
          animate={{ rotateY: isOpen ? -110 : 0, x: isOpen ? "-10%" : "0%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => {
            if (!isOpen) setIsOpen(true);
          }}
        >
          <div className="absolute inset-[5cqw] border-2 border-white/5 opacity-10 shadow-inner pointer-events-none"></div>
          {/* Handle Area */}
          <div className="absolute right-[10%] w-[6cqw] h-[18cqw] bg-black/40 rounded-full border border-white/10 flex items-center justify-center shadow-inner group-hover:bg-black/60 transition-colors pointer-events-none">
            <div className="w-[0.5cqw] h-[10cqw] bg-[#4a5560] rounded-full opacity-30 group-hover:opacity-60 transition-opacity"></div>
          </div>
        </motion.div>

        {/* Inside the Box */}
        <div className="flex-1 flex flex-row relative">
          {/* Main Panel for Switches (Moved to the left) */}
          <div className="flex-1 flex flex-col justify-center items-center p-[4cqw]">
            {/* Left-aligned container for the rows */}
            <div className="flex flex-col items-start gap-[10cqw]">
              {/* Row 1: 5 switches (Indices 0-4, Left-to-Right) */}
              <div className="flex flex-row gap-[3cqw]">
                {switchesState.slice(0, 5).map((isOn, i) => (
                  <div
                    key={`sw-row1-${i}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-[3.5cqw] h-[7cqw] bg-[#111] rounded-[0.4cqw] p-[0.3cqw] shadow-inner cursor-pointer transition-all active:scale-90"
                      onClick={() => onSwitchToggle(i)}
                    >
                      <motion.div
                        animate={{ y: isOn ? "0%" : "100%" }}
                        initial={false}
                        transition={{ type: "tween", duration: 0.1 }}
                        className="w-full h-[50%] bg-[#555] rounded-[0.2cqw] border border-black/50"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: 4 switches (Indices 5-8, Left-to-Right, gap on the right) */}
              <div className="flex flex-row gap-[3cqw]">
                {switchesState.slice(5, 9).map((isOn, i) => (
                  <div
                    key={`sw-row2-${i}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-[3.5cqw] h-[7cqw] bg-[#111] rounded-[0.4cqw] p-[0.3cqw] shadow-inner cursor-pointer transition-all active:scale-90"
                      onClick={() => onSwitchToggle(i + 5)}
                    >
                      <motion.div
                        animate={{ y: isOn ? "0%" : "100%" }}
                        initial={false}
                        transition={{ type: "tween", duration: 0.1 }}
                        className="w-full h-[50%] bg-[#555] rounded-[0.2cqw] border border-black/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Red Lever Compartment (Back to the right) */}
          <div className="w-[25cqw] bg-[#1a1a1a] border-l-4 border-black flex flex-col items-center justify-center relative p-[3cqw]">
            <div className="w-[2cqw] h-[85%] bg-black rounded-full shadow-inner relative flex justify-center">
              {/* Vertical Track */}
              <div className="absolute top-0 bottom-0 w-[0.8cqw] bg-white opacity-10"></div>

              {/* Lever Mechanism */}
              <motion.div
                className="absolute z-10 flex flex-col items-center"
                style={{ top: "5%" }}
                animate={{ y: isPulling ? "45cqh" : "0cqh" }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
              >
                {/* Stick - Layered behind the ball */}
                <div className="w-[1.5cqw] h-[20cqh] bg-[#333] border-x border-black/40 absolute bottom-[2cqw] left-1/2 -translate-x-1/2 -z-10"></div>

                {/* Red Ball Handle - Layered in front */}
                <div
                  className="w-[15cqw] h-[15cqw] bg-[#a00] rounded-full border-[1.2cqw] border-[#500] shadow-2xl cursor-pointer flex items-center justify-center active:scale-95 hover:brightness-110 transition-all relative z-10"
                  onClick={() => {
                    if (isPulling) return;
                    setIsPulling(true);
                    setTimeout(() => {
                      const success = onPullHandle();
                      if (!success) {
                        setIsPulling(false);
                      }
                    }, 400);
                  }}
                >
                  {/* Glossy shine */}
                  <div className="w-1/3 h-1/3 bg-white/30 rounded-full absolute top-[15%] left-[20%] blur-[4px]"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Screws for character */}
        {[
          { top: "2cqw", left: "2cqw" },
          { top: "2cqw", right: "2cqw" },
          { bottom: "2cqw", left: "2cqw" },
          { bottom: "2cqw", right: "2cqw" },
        ].map((pos, i) => (
          <div
            key={`screw-${i}`}
            className="absolute w-[1.2cqw] h-[1.2cqw] bg-[#111] opacity-40 rounded-full"
            style={pos}
          ></div>
        ))}
      </div>
    </CloseUpContainer>
  );
};

const FreezerBoxCloseUp = ({
  onClose,
  onPickupItem,
  hasItem,
  isUnlocked,
  onUnlock,
  onCheat,
}: {
  onClose: () => void;
  onPickupItem: (item: string, e: React.MouseEvent) => void;
  hasItem: (item: string) => boolean;
  isUnlocked: boolean;
  onUnlock: () => void;
  onCheat?: () => void;
}) => {
  const [code, setCode] = useState(isUnlocked ? [6, 6, 4, 1] : [0, 0, 0, 0]);

  const handleScroll = (index: number) => {
    if (isUnlocked) return;
    setCode((prev) => {
      const newCode = [...prev];
      newCode[index] = (newCode[index] + 1) % 10;
      return newCode;
    });
  };

  return (
    <CloseUpContainer onClose={onClose} aspectRatio={1}>
      <div
        className="w-[60cqw] h-[60cqw] max-w-[60vw] max-h-[60vw] bg-[#a0aab5] border-[2cqw] border-[#808e9b] rounded-[1cqw] shadow-2xl relative"
        style={{ perspective: "800px" }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] border-[2cqw] border-t-[4cqw] border-[#808e9b] z-0">
          {!hasItem("car-keys") && (
            <div
              className="w-full h-full cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center p-[5%]"
              onClick={(e) => onPickupItem("car-keys", e)}
            >
              <img
                src="https://i.postimg.cc/3xZj9n9f/mpthwt-rkb.png"
                className="w-[70%] h-[70%] max-w-[200px] max-h-[200px] object-contain filter drop-shadow-xl"
                alt="Car Keys"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-[#d1d5d5] z-10 flex flex-col items-center justify-center gap-[4cqw] border-[1cqw] border-[#a0aab5] origin-top"
          animate={{ rotateX: isUnlocked ? 110 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex gap-[2cqw] bg-[#a0aab5] p-[3cqw] rounded-[1cqw] border-[0.5cqw] border-[#808e9b] shadow-inner">
            {[...code].reverse().map((digit, i) => (
              <div
                key={i}
                className="w-[8cqw] h-[12cqw] bg-white rounded-[0.5cqw] border border-gray-400 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative shadow-md select-none"
                onClick={() => handleScroll(3 - i)}
              >
                <AnimatePresence>
                  <motion.div
                    key={`${3 - i}-${digit}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute text-[5cqw] font-mono font-bold text-black"
                  >
                    {digit}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const currentCode = code.join("");
              if (currentCode === "6641") {
                onUnlock();
              } else if (currentCode === "1112") {
                if (onCheat) onCheat();
              }
            }}
            className="bg-[#5c6b6b] text-white px-[4cqw] py-[1.5cqw] rounded-[1cqw] font-bold hover:bg-[#4a5a5a] transition-colors shadow-md flex items-center justify-center border-[0.5cqw] border-[#7a8b8b]"
          >
            <div className="w-[3cqw] h-[3cqw] rounded-full bg-white/30 border border-white/50"></div>
          </button>

          <div
            className="absolute inset-x-0 inset-y-0 bg-[#a0aab5] border-[1cqw] border-[#808e9b] rounded-none m-[-1cqw]"
            style={{
              transform: "rotateX(180deg) translateZ(1px)",
              backfaceVisibility: "hidden",
            }}
          ></div>
        </motion.div>
      </div>
    </CloseUpContainer>
  );
};

export default function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(true);
  const [isPreloading, setIsPreloading] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const [currentLocation, setCurrentLocation] = useState<Location>("entrance");
  const [inspectingItem, setInspectingItem] = useState<string | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [pickedUpItems, setPickedUpItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [displayItem, setDisplayItem] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [isCarEngineOn, setIsCarEngineOn] = useState(false);
  const [pendingRemovals, setPendingRemovals] = useState<string[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    if (!inventoryOpen && pendingRemovals.length > 0) {
      setInventoryItems((prev) =>
        prev.filter((item) => !pendingRemovals.includes(item)),
      );
      if (selectedItem && pendingRemovals.includes(selectedItem)) {
        setSelectedItem(null);
      }
      setPendingRemovals([]);
    }
  }, [inventoryOpen, pendingRemovals, selectedItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use both Ctrl and Meta to support macOS (Cmd+,) and Windows/Linux (Ctrl+,)
      if ((e.ctrlKey || e.metaKey) && (e.key === ',' || e.code === 'Comma' || e.key === 'ת')) {
        e.preventDefault();
        setShowRegistration(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerAddAllCheat = () => {
    const itemsToAdd = [
      "uv-flashlight",
      "gloves",
      "sheet-music",
      "broom",
      "stop-sign",
      "car-keys",
      "bedroom-key",
      "silver-key",
      "bathroom-key",
      "pasta",
      "cream",
      "pot",
      "recipe",
      "blue-paint",
    ];

    setInventoryItems((prev) => {
      const current = [...prev];
      itemsToAdd.forEach((item) => {
        if (!current.includes(item)) current.push(item);
      });
      return current;
    });
    setPickedUpItems((prev) => {
      const current = [...prev];
      itemsToAdd.forEach((item) => {
        if (!current.includes(item)) current.push(item);
      });
      return current;
    });
    handleMessage("✓ כל החפצים נוספו לתיק ציוד!", "system");
    setIsInventoryPulsing(true);
    setTimeout(() => setIsInventoryPulsing(false), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        setShowParticipants((prev) => !prev);
      } else if (e.ctrlKey && (e.key === "ֿ" || e.code === "Backquote")) {
        e.preventDefault();
        triggerAddAllCheat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMessage = (msg: string, type: "system" | "speech" = "system") => {
    setActiveMessage(null);
    setActiveSpeech(null);
    if (type === "system") {
      setTimeout(() => setActiveMessage(msg), 10);
    } else {
      setTimeout(() => setActiveSpeech(msg), 10);
    }
  };

  const handleInspectItem = (item: string | null) => {
    if (item) {
      setActiveMessage(null);
      setActiveSpeech(null);
    }
    setDisplayItem(item);
  };

  const handleSpeechComplete = () => {
    setActiveSpeech(null);
  };

  const [isInventoryPulsing, setIsInventoryPulsing] = useState(false);
  const [cabinetScrews, setCabinetScrews] = useState([true, true, true, true]);
  const [isFusePlaced, setIsFusePlaced] = useState(false);
  const [isTvCodeVisible, setIsTvCodeVisible] = useState(false);
  const [isGloveboxUnlocked, setIsGloveboxUnlocked] = useState(false);
  const [isCarUnlocked, setIsCarUnlocked] = useState(false);
  const [isClownTalked, setIsClownTalked] = useState(false);
  const [isLoungeUnlocked, setIsLoungeUnlocked] = useState(false);
  const [isMusicStorageLightOn, setIsMusicStorageLightOn] = useState(false);
  const [isSheetMusicPlaced, setIsSheetMusicPlaced] = useState(false);
  const [isBathroomUnlocked, setIsBathroomUnlocked] = useState(false);
  const [paintingScrews, setPaintingScrews] = useState([
    true,
    true,
    true,
    true,
  ]);
  const [isPaintingRemoved, setIsPaintingRemoved] = useState(false);
  const [isBathroomKeyPickedUp, setIsBathroomKeyPickedUp] = useState(false);
  const [isPotOnStove, setIsPotOnStove] = useState(false);
  const [isPastaInPot, setIsPastaInPot] = useState(false);
  const [isCreamInPot, setIsCreamInPot] = useState(false);
  const [isChefHappy, setIsChefHappy] = useState(false);
  const [isInspectorHappy, setIsInspectorHappy] = useState(false);
  const [isPainterHappy, setIsPainterHappy] = useState(false);
  const [isPianistHappy, setIsPianistHappy] = useState(false);
  const [isCaretakerHappy, setIsCaretakerHappy] = useState(false);
  const [isBedroomUnlocked, setIsBedroomUnlocked] = useState(false);
  const [switchesState, setSwitchesState] = useState<boolean[]>(
    new Array(9).fill(false),
  );
  const [chefErrorTimer, setChefErrorTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [hasAgreedToHelpInspector, setHasAgreedToHelpInspector] =
    useState(false);
  const [hasAgreedToHelpChef, setHasAgreedToHelpChef] = useState(false);
  const [hasAgreedToHelpPainter, setHasAgreedToHelpPainter] = useState(false);
  const [hasAgreedToHelpPianist, setHasAgreedToHelpPianist] = useState(false);
  const [hasAgreedToHelpCaretaker, setHasAgreedToHelpCaretaker] =
    useState(false);
  const [isFreezerUnlocked, setIsFreezerUnlocked] = useState(false);
  const [isStudioBoxUnlocked, setIsStudioBoxUnlocked] = useState(false);
  const [isKitchenBoxUnlocked, setIsKitchenBoxUnlocked] = useState(false);
  const [showGlovesReveal, setShowGlovesReveal] = useState(false);
  const [showBrokenBroomReveal, setShowBrokenBroomReveal] = useState(false);
  const [showUvFlashlightReveal, setShowUvFlashlightReveal] = useState(false);
  const [isVaseBroken, setIsVaseBroken] = useState(false);
  const [hasCandleRevealed, setHasCandleRevealed] = useState(false);
  const [showCandleReveal, setShowCandleReveal] = useState(false);
  const [showLitCandleReveal, setShowLitCandleReveal] = useState(false);

  const [characterInteraction, setCharacterInteraction] = useState<{
    active: boolean;
    step: number;
    choice: number | null;
    characterType: CharacterType;
  }>({ active: false, step: 0, choice: null, characterType: null });

  const [isPainterGotBroom, setIsPainterGotBroom] = useState(false);

  const handlePianoSequenceComplete = () => {
    setInspectingItem(null);
    setIsPianistHappy(true);
    handleRemoveItem("sheet-music");
    setTimeout(() => {
      setCharacterInteraction({
        active: true,
        step: 1,
        choice: null,
        characterType: "pianist-happy",
      });
    }, 500);
  };

  const handleNavigate = (location: Location) => {
    if (characterInteraction.active) {
      setCharacterInteraction({
        active: false,
        step: 0,
        choice: null,
        characterType: null,
      });
      return;
    }

    if (location === "bathroom" && !isBathroomUnlocked) {
      if (selectedItem === "bathroom-key") {
        setIsBathroomUnlocked(true);
        handleRemoveItem("bathroom-key");
        setCurrentLocation(location);
      } else {
        handleMessage("נראה שהדלת נעולה", "system");
      }
      return;
    }
    setCurrentLocation(location);
    setInventoryOpen(false);
  };

  const handlePickupItem = (item: string, e?: React.MouseEvent) => {
    // Show pickup message immediately with item name
    const itemName = ITEM_NAMES[item] || item;
    handleMessage(`✓ ${itemName}`, "system");

    // Apply fade-out and slight shrink directly to the element before state changes cause unmount
    if (e) {
      const el = e.currentTarget as HTMLElement;
      el.style.transition = "all 0.3s ease-in-out";
      el.style.opacity = "0";
      el.style.transform = "scale(0.8)";
      el.style.pointerEvents = "none";
    }

    // Delay slightly to let the fade out animation finish visibly
    setTimeout(
      () => {
        setInventoryItems((prev) => {
          if (!prev.includes(item)) {
            if (prev.length === 0) setInventoryOpen(true);
            return [item, ...prev];
          }
          return prev;
        });
        setPickedUpItems((prev) =>
          prev.includes(item) ? prev : [...prev, item],
        );
        // Pulse inventory after the item vanishes into it
        setIsInventoryPulsing(true);

        if (item === "bathroom-key") {
          handleRemoveItem("ladder", true);
        }

        setTimeout(() => setIsInventoryPulsing(false), 300);
      },
      e ? 280 : 0,
    );
  };

  const handleRemoveItem = (item: string, delayed: boolean = false) => {
    if (delayed) {
      setPendingRemovals((prev) => {
        if (!prev.includes(item)) return [...prev, item];
        return prev;
      });
    } else {
      setInventoryItems((prev) => prev.filter((i) => i !== item));
      if (selectedItem === item) setSelectedItem(null);
    }
  };

  const handlePlaceFuse = () => {
    setIsFusePlaced(true);
    handleRemoveItem("fuse");
  };

  const handlePlaceSheetMusic = () => {
    setIsSheetMusicPlaced(true);
    handleRemoveItem("sheet-music");
  };

  const handlePullSwitchesHandle = () => {
    // Combination check based on RTL layout:
    // User description (Right to Left):
    // Shura 1: 1.UP, 2.DOWN, 3.UP, 4.DOWN, 5.DOWN (Idx 0 is rightmost, Idx 4 is leftmost)
    // Shura 2: 1.UP, 2.DOWN, 3.DOWN, 4.UP (Idx 5 is rightmost, Idx 8 is leftmost)

    const correctR1 =
      switchesState[0] === true && // 1st Right
      switchesState[1] === false && // 2nd Right
      switchesState[2] === true && // 3rd Right
      switchesState[3] === false && // 4th Right
      switchesState[4] === false; // 5th Right (Leftmost)

    const correctR2 =
      switchesState[5] === true && // 1st Right
      switchesState[6] === false && // 2nd Right
      switchesState[7] === false && // 3rd Right
      switchesState[8] === true; // 4th Right (Leftmost)

    if (correctR1 && correctR2) {
      setTimeout(() => {
        setIsMusicStorageLightOn(true);
        setInspectingItem(null); // Exit close-up
      }, 1000); // 1-second delay so the player sees the lever stay down
      return true;
    } else {
      return false;
    }
  };

  const hasItem = (item: string) => pickedUpItems.includes(item);

  const renderCurrentLocation = () => {
    switch (currentLocation) {
      case "entrance":
        return (
          <Entrance
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isClownTalked={isClownTalked}
            onCharacterClick={() =>
              setCharacterInteraction({
                active: true,
                step: 1,
                choice: null,
                characterType: "clown",
              })
            }
            isCharacterInteracting={
              characterInteraction.active &&
              characterInteraction.characterType === "clown"
            }
          />
        );
      case "lounge":
        return (
          <Lounge
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            isPaintingRemoved={isPaintingRemoved}
            paintingScrews={paintingScrews}
            onMessage={handleMessage}
            selectedItem={selectedItem}
            onCloseInventory={() => setInventoryOpen(false)}
            isBathroomKeyPickedUp={isBathroomKeyPickedUp}
            onLightCandle={() => setShowLitCandleReveal(true)}
          />
        );
      case "livingroom":
        return (
          <LivingRoom
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            isFusePlaced={isFusePlaced}
            selectedItem={selectedItem}
            isTvCodeVisible={isTvCodeVisible}
            onUseRemote={() => {
              setIsTvCodeVisible(true);
              handleRemoveItem("remote");
            }}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isCharacterInteracting={
              characterInteraction.active &&
              (characterInteraction.characterType === "caretaker" ||
                characterInteraction.characterType === "caretaker-vase" ||
                characterInteraction.characterType === "caretaker-happy" ||
                characterInteraction.characterType === "caretaker-unlit-candle" ||
                characterInteraction.characterType === "caretaker-final")
            }
            onCharacterClick={() => {
              if (selectedItem === "lit-candle" && !isCaretakerHappy) {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: "caretaker-happy",
                });
              } else if (selectedItem === "candle" && !isCaretakerHappy) {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: "caretaker-unlit-candle",
                });
              } else {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: isCaretakerHappy
                    ? "caretaker-final"
                    : "caretaker",
                });
              }
            }}
            onVaseInteract={() =>
              setCharacterInteraction({
                active: true,
                step: 1,
                choice: null,
                characterType: "caretaker-vase",
              })
            }
            characterInteractionStep={characterInteraction.step}
            onNextStep={() => {
              let lastStep = 1;
              if (characterInteraction.characterType === "caretaker") {
                lastStep = hasAgreedToHelpCaretaker ? 1 : 8;
              } else if (characterInteraction.characterType === "caretaker-final") {
                lastStep = 11;
              } else if (characterInteraction.characterType === "caretaker-happy") {
                lastStep = 3;
              } else if (
                characterInteraction.characterType === "caretaker-unlit-candle" ||
                characterInteraction.characterType === "caretaker-vase"
              ) {
                lastStep = 1;
              }

              if (characterInteraction.step === lastStep) {
                let deferClose = false;
                if (
                  characterInteraction.characterType === "caretaker" &&
                  characterInteraction.choice === 1
                ) {
                  setHasAgreedToHelpCaretaker(true);
                }
                if (characterInteraction.characterType === "caretaker-happy") {
                  setIsCaretakerHappy(true);
                  handleRemoveItem("lit-candle");
                  if (selectedItem === "lit-candle") setSelectedItem(null);
                  deferClose = true;
                  setCharacterInteraction({
                    active: true,
                    step: 1,
                    choice: null,
                    characterType: "caretaker-final",
                  });
                }
                if (characterInteraction.characterType === "caretaker-final") {
                  if (!inventoryItems.includes("bedroom-key") && !isBedroomUnlocked) {
                    handlePickupItem("bedroom-key");
                  }
                }
                if (!deferClose) {
                  setCharacterInteraction({
                    active: false,
                    step: 0,
                    choice: null,
                    characterType: null,
                  });
                }
              } else {
                setCharacterInteraction((prev) => ({
                  ...prev,
                  step: prev.step + 1,
                }));
              }
            }}
            hasAgreedToHelpCaretaker={hasAgreedToHelpCaretaker}
            isCaretakerHappy={
              isCaretakerHappy ||
              characterInteraction.characterType === "caretaker-happy"
            }
            onRemoveItem={handleRemoveItem}
          />
        );
      case "hallway":
        return (
          <Hallway
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            isBathroomUnlocked={isBathroomUnlocked}
            onMessage={(msg) => handleMessage(msg, "speech")}
          />
        );
      case "kitchen":
        return (
          <Kitchen
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isCharacterInteracting={
              characterInteraction.active &&
              (characterInteraction.characterType === "chef" ||
                characterInteraction.characterType === "chef-norecipe" ||
                characterInteraction.characterType === "chef-final")
            }
            onCharacterClick={() => {
              if (selectedItem === "ready-pasta") {
                setSelectedItem(null);
                setIsChefHappy(true);
                handleRemoveItem("ready-pasta");
                setInventoryItems((prev) =>
                  prev.filter(
                    (i) => !["milk", "eggs", "chicken", "pan"].includes(i),
                  ),
                );
                setCharacterInteraction({
                  active: true,
                  step: 3,
                  choice: 1,
                  characterType: "chef",
                });
              } else {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: isChefHappy ? "chef-final" : "chef",
                });
              }
            }}
            characterInteractionStep={characterInteraction.step}
            onNextStep={() => {
              let lastStep = 0;
              if (
                characterInteraction.choice === 1 &&
                characterInteraction.step >= 3
              ) {
                lastStep = 4;
              } else if (isChefHappy) {
                lastStep = 1;
              } else {
                lastStep = hasAgreedToHelpChef
                  ? 1
                  : characterInteraction.choice === 2
                    ? 6
                    : 5;
              }

              if (characterInteraction.step === lastStep) {
                let deferClose = false;
                if (characterInteraction.characterType === "chef") {
                  if (
                    characterInteraction.choice === 1 &&
                    characterInteraction.step >= 3
                  ) {
                    setShowGlovesReveal(true);
                  } else if (characterInteraction.choice === 1) {
                    setHasAgreedToHelpChef(true);
                  }
                }

                if (!deferClose) {
                  setCharacterInteraction({
                    active: false,
                    step: 0,
                    choice: null,
                    characterType: null,
                  });
                }
              } else {
                setCharacterInteraction((prev) => ({
                  ...prev,
                  step: prev.step + 1,
                }));
              }
            }}
            isChefHappy={isChefHappy}
          />
        );
      case "music":
        return (
          <MusicRoom
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isCharacterInteracting={
              characterInteraction.active &&
              (characterInteraction.characterType === "pianist" ||
                characterInteraction.characterType === "pianist-door" ||
                characterInteraction.characterType === "pianist-happy" ||
                characterInteraction.characterType === "pianist-final")
            }
            onCharacterClick={(type) => {
              setCharacterInteraction({
                active: true,
                step: 1,
                choice: null,
                characterType: isPianistHappy
                  ? "pianist-final"
                  : type === "pianist-door"
                    ? "pianist-door"
                    : "pianist",
              });
            }}
            characterInteractionStep={characterInteraction.step}
            onNextStep={() => {
              const lastStep = hasAgreedToHelpPianist
                ? 1
                : characterInteraction.choice === 2
                  ? 9
                  : 8;
              if (characterInteraction.step === lastStep) {
                if (characterInteraction.choice === 1)
                  setHasAgreedToHelpPianist(true);
                setCharacterInteraction({
                  active: false,
                  step: 0,
                  choice: null,
                  characterType: null,
                });
              } else {
                setCharacterInteraction((prev) => ({
                  ...prev,
                  step: prev.step + 1,
                }));
              }
            }}
            hasAgreedToHelpPianist={hasAgreedToHelpPianist}
            isPianistHappy={isPianistHappy}
          />
        );
      case "music-storage":
        return (
          <MusicStorage
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isLightOn={isMusicStorageLightOn}
          />
        );
      case "garage":
        return (
          <Garage
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "system")}
            selectedItem={selectedItem}
            isCarOn={isCarEngineOn}
            isCarUnlocked={isCarUnlocked}
            isInspectorHappy={
              isInspectorHappy ||
              (characterInteraction.active &&
                characterInteraction.characterType === "inspector-stopsign")
            }
            isCharacterInteracting={
              characterInteraction.active &&
              (characterInteraction.characterType === "inspector" ||
                characterInteraction.characterType === "inspector-stopsign" ||
                characterInteraction.characterType === "inspector-final")
            }
            onCharacterClick={() => {
              if (selectedItem === "stick-stop-sign") {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: "inspector-stopsign",
                });
              } else {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: isInspectorHappy ? "inspector-final" : "inspector",
                });
              }
            }}
            characterInteractionStep={characterInteraction.step}
            onNextStep={() => {
              let lastStep = 4;
              if (characterInteraction.characterType === "inspector")
                lastStep = hasAgreedToHelpInspector ? 1 : 4;
              else if (
                characterInteraction.characterType === "inspector-stopsign"
              )
                lastStep = 5;
              else if (characterInteraction.characterType === "inspector-final")
                lastStep = 2;

              if (characterInteraction.step === lastStep) {
                if (
                  characterInteraction.choice === 1 &&
                  characterInteraction.characterType === "inspector"
                )
                  setHasAgreedToHelpInspector(true);
                setCharacterInteraction({
                  active: false,
                  step: 0,
                  choice: null,
                  characterType: null,
                });
              } else {
                setCharacterInteraction((prev) => ({
                  ...prev,
                  step: prev.step + 1,
                }));
              }
            }}
          />
        );
      case "studio":
        return (
          <ArtStudio
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isCharacterInteracting={
              characterInteraction.active &&
              (characterInteraction.characterType === "painter" ||
                characterInteraction.characterType === "painter-broom" ||
                characterInteraction.characterType === "painter-final" ||
                characterInteraction.characterType === "painter-broom-final")
            }
            onCharacterClick={() => {
              if (selectedItem === "blue-paint") {
                handleRemoveItem("blue-paint");
                setCharacterInteraction({
                  active: true,
                  step: 6,
                  choice: null,
                  characterType: "painter",
                });
              } else if (selectedItem === "broom" && isPainterHappy) {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: "painter-broom",
                });
              } else {
                setCharacterInteraction({
                  active: true,
                  step: 1,
                  choice: null,
                  characterType: isPainterGotBroom
                    ? "painter-final"
                    : isPainterHappy
                      ? "painter"
                      : "painter",
                });
              }
            }}
            characterInteractionStep={characterInteraction.step}
            onNextStep={() => {
              let lastStep = 0;
              if (characterInteraction.characterType === "painter") {
                if (characterInteraction.step >= 6) {
                  lastStep = 9;
                } else if (isPainterHappy) {
                  lastStep = 1;
                } else if (hasAgreedToHelpPainter) {
                  lastStep = 1;
                } else {
                  lastStep = 5;
                }
              }

              if (characterInteraction.characterType === "painter-final") {
                lastStep = 7;
              }

              if (characterInteraction.characterType === "painter-broom-final") {
                lastStep = 7;
              }

              if (characterInteraction.characterType === "painter-broom")
                lastStep = 3;

              if (characterInteraction.step === lastStep) {
                if (characterInteraction.characterType === "painter") {
                  if (characterInteraction.choice === 1 && lastStep !== 9)
                    setHasAgreedToHelpPainter(true);
                  if (lastStep === 9) setIsPainterHappy(true);
                }
                setCharacterInteraction({
                  active: false,
                  step: 0,
                  choice: null,
                  characterType: null,
                });
              } else {
                setCharacterInteraction((prev) => ({
                  ...prev,
                  step: prev.step + 1,
                }));
              }
            }}
            isPainterHappy={isPainterHappy}
          />
        );
      case "bathroom":
        return (
          <Bathroom
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
          />
        );
      case "bedroom":
        return (
          <Bedroom
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
          />
        );
      case "stairs":
        return (
          <StairsTransition
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isClownTalked={isClownTalked}
            isBedroomUnlocked={isBedroomUnlocked}
            selectedItem={selectedItem}
            onUnlockBedroom={() => setIsBedroomUnlocked(true)}
            onRemoveItem={handleRemoveItem}
            onCharacterClick={() =>
              setCharacterInteraction({
                active: true,
                step: 1,
                choice: null,
                characterType: "clown-stairs",
              })
            }
            isCharacterInteracting={
              characterInteraction.active &&
              characterInteraction.characterType === "clown-stairs"
            }
          />
        );
      default:
        return (
          <Entrance
            onNavigate={handleNavigate}
            onInspect={setInspectingItem}
            onPickupItem={handlePickupItem}
            hasItem={hasItem}
            onMessage={(msg) => handleMessage(msg, "speech")}
            isClownTalked={isClownTalked}
            onCharacterClick={() =>
              setCharacterInteraction({
                active: true,
                step: 1,
                choice: null,
                characterType: "clown",
              })
            }
            isCharacterInteracting={
              characterInteraction.active &&
              characterInteraction.characterType === "clown"
            }
          />
        );
    }
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 w-[1px] h-[1px] opacity-[0.01] pointer-events-none overflow-hidden z-[-1]"
        aria-hidden="true"
      >
        {PRELOAD_IMAGES.map((src, i) => (
          <img
            key={`${i}-global-preload`}
            src={src}
            referrerPolicy="no-referrer"
            width="1"
            height="1"
            alt=""
          />
        ))}
      </div>
      <div
        className="w-[100dvw] h-[100dvh] bg-black flex items-center justify-center overflow-hidden font-sans select-none"
        dir="rtl"
      >
        <div
          className="relative aspect-video w-[95dvw] max-w-[calc(95dvh*16/9)] max-h-[95dvh] bg-black overflow-hidden shadow-2xl rounded-lg"
          style={{ perspective: "100cqw", containerType: "size" }}
        >
          <AnimatePresence>
            {showMobileWarning ? (
              <motion.div
                key="mobile-warning"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-[100000]"
              >
                <MobileWarningScreen onAcknowledge={() => setShowMobileWarning(false)} />
              </motion.div>
            ) : isPreloading ? (
              <motion.div
                key="preloader"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-[99999]"
              >
                <LoadingScreen onComplete={() => setIsPreloading(false)} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="absolute inset-0 z-[9999] pointer-events-none bg-[url('https://i.postimg.cc/ncKhRTsy/GRAIN.png')] opacity-40"></div>
          <OrientationLock disabled={showRegistration} isPortrait={isPortrait} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentLocation}
              initial={{ opacity: 0, filter: "blur(5px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              {renderCurrentLocation()}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)] pointer-events-none opacity-80" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {inspectingItem?.startsWith("kitchen-cabinet-") && (
              <KitchenCabinet
                onClose={() => setInspectingItem(null)}
                index={parseInt(inspectingItem.split("-")[2])}
                selectedItem={selectedItem}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                screws={cabinetScrews}
                onScrewClick={(i) => {
                  if (selectedItem === "screwdriver") {
                    setCabinetScrews((prev) => {
                      const newScrews = [...prev];
                      newScrews[i] = false;
                      return newScrews;
                    });
                  }
                }}
                isBoxUnlocked={isKitchenBoxUnlocked}
                onUnlockBox={() => setIsKitchenBoxUnlocked(true)}
              />
            )}
            {inspectingItem === "kitchen-drawer" && (
              <KitchenDrawer
                onClose={() => setInspectingItem(null)}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                isFusePlaced={isFusePlaced}
              />
            )}
            {inspectingItem === "fridge" && (
              <Fridge
                onClose={() => setInspectingItem(null)}
                onInspectBox={() => setInspectingItem("freezer-box")}
                onInspectInterior={() => setInspectingItem("fridge-interior")}
              />
            )}
            {inspectingItem === "fridge-interior" && (
              <FridgeInteriorCloseUp
                onClose={() => setInspectingItem("fridge")}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
              />
            )}
            {inspectingItem === "freezer-box" && (
              <FreezerBoxCloseUp
                onClose={() => setInspectingItem("fridge")}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                isUnlocked={isFreezerUnlocked}
                onUnlock={() => setIsFreezerUnlocked(true)}
                onCheat={triggerAddAllCheat}
              />
            )}
            {inspectingItem === "stove" && (
              <StoveCloseUp
                onClose={() => setInspectingItem(null)}
                selectedItem={selectedItem}
                hasRecipe={inventoryItems.includes("recipe")}
                isPotOnStove={isPotOnStove}
                isPastaInPot={isPastaInPot}
                isCreamInPot={isCreamInPot}
                onPlacePot={() => {
                  setIsPotOnStove(true);
                  handleRemoveItem("pot");
                }}
                onPlacePasta={() => {
                  setIsPastaInPot(true);
                  handleRemoveItem("pasta");
                }}
                onPlaceCream={() => {
                  setIsCreamInPot(true);
                  handleRemoveItem("cream");
                }}
                onMissingRecipeError={() => {
                  setInspectingItem(null);
                  setCharacterInteraction({
                    active: true,
                    step: 1,
                    choice: null,
                    characterType: "chef-norecipe",
                  });
                }}
                onChefError={() => {
                  const returns: string[] = [];
                  if (isPotOnStove) returns.push("pot");
                  if (isPastaInPot) returns.push("pasta");
                  if (isCreamInPot) returns.push("cream");

                  if (returns.length > 0) {
                    setInventoryItems((prev) => {
                      let newItems = [...prev];
                      returns.forEach((item) => {
                        if (!newItems.includes(item))
                          newItems = [item, ...newItems];
                      });
                      return newItems;
                    });
                  }
                  setIsPotOnStove(false);
                  setIsPastaInPot(false);
                  setIsCreamInPot(false);
                }}
                onPickupPasta={(e) => {
                  handlePickupItem("ready-pasta");
                  setIsPotOnStove(false);
                  setIsPastaInPot(false);
                  setIsCreamInPot(false);
                }}
              />
            )}
            {inspectingItem === "fuse-box" && (
              <FuseBox
                onClose={() => setInspectingItem(null)}
                selectedItem={selectedItem}
                isFusePlaced={isFusePlaced}
                onPlaceFuse={handlePlaceFuse}
              />
            )}
            {inspectingItem === "car-interior" && (
              <CarInterior
                onClose={() => setInspectingItem(null)}
                isUnlocked={isGloveboxUnlocked}
                onInspectLock={() => setInspectingItem("glovebox-lock")}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                isCarOn={isCarEngineOn}
                selectedItem={selectedItem}
                onMessage={(msg) => handleMessage(msg, "system")}
                onToggleEngine={() => {
                  if (!isCarEngineOn) {
                    setIsCarEngineOn(true);
                    setIsCarUnlocked(true);
                    handleRemoveItem("car-keys");
                  }
                }}
              />
            )}
            {inspectingItem === "car-trunk" && (
              <CarTrunkCloseUp
                onClose={() => setInspectingItem(null)}
                isCarOn={isCarEngineOn}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                onMessage={(msg) => handleMessage(msg, "system")}
              />
            )}
            {inspectingItem === "glovebox-lock" && (
              <GloveboxLockCloseUp
                onClose={() => setInspectingItem("car-interior")}
                onUnlock={() => setIsGloveboxUnlocked(true)}
                selectedItem={selectedItem}
              />
            )}
            {inspectingItem === "paint-shelf" && (
              <PaintShelf
                onClose={() => setInspectingItem(null)}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
              />
            )}
            {inspectingItem === "canvas" && (
              <BlankCanvas
                onClose={() => setInspectingItem(null)}
                selectedItem={selectedItem}
              />
            )}
            {inspectingItem === "rug-corner" && (
              <RugCorner onClose={() => setInspectingItem(null)} />
            )}
            {inspectingItem === "piano" && (
              <PianoCloseUp
                onClose={() => setInspectingItem(null)}
                selectedItem={selectedItem}
                isSheetMusicPlaced={isSheetMusicPlaced}
                onPlaceSheetMusic={handlePlaceSheetMusic}
                onSequenceComplete={handlePianoSequenceComplete}
              />
            )}
            {inspectingItem === "bathroom-mirror" && (
              <BathroomMirrorCloseUp onClose={() => setInspectingItem(null)} />
            )}
            {inspectingItem === "bedroom-letter" && (
              <BedroomLetterCloseUp 
                onClose={() => setInspectingItem(null)} 
                onLeaveDetails={() => {
                  setInspectingItem(null);
                  setShowRegistration(true);
                }}
              />
            )}
            {inspectingItem === "shower-drain" && (
              <ShowerDrainCloseUp
                onClose={() => setInspectingItem(null)}
                onMessage={(msg) => handleMessage(msg, "system")}
                selectedItem={selectedItem}
                onPickupItem={handlePickupItem}
                onRemoveItem={handleRemoveItem}
                hasItem={hasItem}
              />
            )}
            {inspectingItem === "lounge-bookshelf" && (
              <LoungeBookshelfCloseUp
                onClose={() => setInspectingItem(null)}
                onInspectLock={() => setInspectingItem("lounge-lock")}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                selectedItem={selectedItem}
              />
            )}
            {inspectingItem === "lounge-lock" && (
              <LoungeLockCloseUp
                onClose={() => setInspectingItem("lounge-bookshelf")}
                onUnlock={() => setIsLoungeUnlocked(true)}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                selectedItem={selectedItem}
                isUnlocked={isLoungeUnlocked}
              />
            )}
            {inspectingItem === "lounge-mantle" && (
              <LoungeMantleCloseUp
                onClose={() => setInspectingItem(null)}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
              />
            )}
            {inspectingItem === "painting" && (
              <PaintingCloseUp
                onClose={() => setInspectingItem(null)}
                onPickupItem={(item, e) => {
                  handlePickupItem(item, e);
                  if (item === "bathroom-key")
                    setTimeout(() => setIsBathroomKeyPickedUp(true), 300);
                }}
                hasItem={hasItem}
                selectedItem={selectedItem}
                screws={paintingScrews}
                onRemoveScrew={(idx) => {
                  const newScrews = [...paintingScrews];
                  newScrews[idx] = false;
                  setPaintingScrews(newScrews);
                }}
                isPaintingRemoved={isPaintingRemoved}
                onRemovePainting={() => setIsPaintingRemoved(true)}
                isKeyPickedUp={isBathroomKeyPickedUp}
              />
            )}
            {inspectingItem === "studio-box" && (
              <StudioBoxCloseUp
                onClose={() => setInspectingItem(null)}
                selectedItem={selectedItem}
                onPickupItem={handlePickupItem}
                hasItem={hasItem}
                isUnlocked={isStudioBoxUnlocked}
                onUnlock={() => {
                  handleRemoveItem("silver-key");
                  setIsStudioBoxUnlocked(true);
                }}
              />
            )}
            {inspectingItem === "switches-box" && (
              <SwitchesBoxCloseUp
                onClose={() => setInspectingItem(null)}
                switchesState={switchesState}
                onSwitchToggle={(idx) => {
                  const newState = [...switchesState];
                  newState[idx] = !newState[idx];
                  setSwitchesState(newState);
                }}
                onPullHandle={handlePullSwitchesHandle}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {characterInteraction.active && (
              <CharacterInteractionOverlay
                step={characterInteraction.step}
                choice={characterInteraction.choice}
                characterType={characterInteraction.characterType}
                hasAgreedToHelpInspector={hasAgreedToHelpInspector}
                hasAgreedToHelpChef={hasAgreedToHelpChef}
                onNext={() => {
                  let lastStep = 0;
                  if (characterInteraction.characterType === "painter-final") {
                    lastStep = 7;
                  } else if (characterInteraction.characterType === "inspector-final") {
                    lastStep = 5;
                  } else if (characterInteraction.characterType === "chef-final") {
                    lastStep = 6;
                  } else if (characterInteraction.characterType === "pianist-final") {
                    lastStep = 7;
                  } else if (characterInteraction.characterType === "caretaker-final") {
                    lastStep = 11;
                  } else if (characterInteraction.characterType?.endsWith("-final")) {
                    lastStep = 1;
                  } else if (
                    characterInteraction.characterType === "inspector"
                  ) {
                    lastStep = hasAgreedToHelpInspector ? 1 : 4;
                  } else if (
                    characterInteraction.characterType === "painter-broom"
                  ) {
                    lastStep = 3;
                  } else if (
                    characterInteraction.characterType === "inspector-stopsign"
                  ) {
                    lastStep = 5;
                  } else if (characterInteraction.characterType === "chef") {
                    if (
                      characterInteraction.choice === 1 &&
                      characterInteraction.step >= 3
                    ) {
                      lastStep = 4;
                    } else if (isChefHappy) {
                      lastStep = 1;
                    } else {
                      lastStep = hasAgreedToHelpChef
                        ? 1
                        : characterInteraction.choice === 2
                          ? 6
                          : 5;
                    }
                  } else if (
                    characterInteraction.characterType === "chef-norecipe"
                  ) {
                    lastStep = 1;
                  } else if (characterInteraction.characterType === "painter") {
                    if (characterInteraction.step >= 6) {
                      lastStep = 9;
                    } else if (isPainterHappy) {
                      lastStep = 1;
                    } else {
                      lastStep = hasAgreedToHelpPainter
                        ? 1
                        : characterInteraction.choice !== null
                          ? 5
                          : 4;
                    }
                  } else if (characterInteraction.characterType === "pianist") {
                    lastStep = hasAgreedToHelpPianist
                      ? 1
                      : characterInteraction.choice === 2
                        ? 9
                        : 8;
                  } else if (
                    characterInteraction.characterType === "pianist-door"
                  ) {
                    lastStep = hasAgreedToHelpPianist
                      ? 1
                      : characterInteraction.choice === 2
                        ? 9
                        : 8;
                  } else if (
                    characterInteraction.characterType === "pianist-happy"
                  ) {
                    lastStep = 3;
                  } else if (
                    characterInteraction.characterType === "caretaker"
                  ) {
                    lastStep = hasAgreedToHelpCaretaker ? 1 : 8;
                  } else if (
                    characterInteraction.characterType === "caretaker-vase"
                  ) {
                    lastStep = 1;
                  } else if (
                    characterInteraction.characterType === "caretaker-happy"
                  ) {
                    lastStep = 3;
                  } else if (
                    characterInteraction.characterType ===
                    "caretaker-unlit-candle"
                  ) {
                    lastStep = 1;
                  } else if (characterInteraction.characterType === "clown") {
                    lastStep = 6;
                  } else if (
                    characterInteraction.characterType === "clown-stairs"
                  ) {
                    lastStep = (isBedroomUnlocked || inventoryItems.includes("bedroom-key")) ? 2 : 4;
                  }

                  if (characterInteraction.step === lastStep) {
                    let deferClose = false;
                    if (
                      characterInteraction.characterType === "inspector" &&
                      characterInteraction.choice === 1
                    )
                      setHasAgreedToHelpInspector(true);
                    if (
                      characterInteraction.characterType === "painter-broom"
                    ) {
                      setShowBrokenBroomReveal(true);
                      handleRemoveItem("broom");
                      setIsPainterGotBroom(true);
                    }
                    if (
                      characterInteraction.characterType ===
                      "inspector-stopsign"
                    ) {
                      setIsInspectorHappy(true);
                      setShowUvFlashlightReveal(true);
                      handleRemoveItem("stick-stop-sign");
                    }
                    if (characterInteraction.characterType === "chef") {
                      if (
                        characterInteraction.choice === 1 &&
                        characterInteraction.step >= 3
                      ) {
                        setShowGlovesReveal(true);
                      } else if (characterInteraction.choice === 1) {
                        setHasAgreedToHelpChef(true);
                      }
                    }
                    if (characterInteraction.characterType === "painter") {
                      if (characterInteraction.step === 9) {
                        setIsPainterHappy(true);
                      } else if (characterInteraction.choice === 1) {
                        setHasAgreedToHelpPainter(true);
                      }
                    }
                    if (
                      (characterInteraction.characterType === "pianist" ||
                        characterInteraction.characterType ===
                          "pianist-door") &&
                      characterInteraction.choice === 1
                    )
                      setHasAgreedToHelpPianist(true);
                    if (
                      characterInteraction.characterType === "caretaker" &&
                      characterInteraction.choice === 1
                    )
                      setHasAgreedToHelpCaretaker(true);
                    if (
                      characterInteraction.characterType === "caretaker-happy"
                    ) {
                      setIsCaretakerHappy(true);
                      handleRemoveItem("lit-candle");
                      if (selectedItem === "lit-candle") setSelectedItem(null);
                      deferClose = true;
                      setCharacterInteraction({
                        active: true,
                        step: 1,
                        choice: null,
                        characterType: "caretaker-final",
                      });
                    }
                    if (
                      characterInteraction.characterType === "caretaker-final"
                    ) {
                      if (!inventoryItems.includes("bedroom-key") && !isBedroomUnlocked) {
                        handlePickupItem("bedroom-key");
                      }
                    }
                    if (characterInteraction.characterType === "clown")
                      setIsClownTalked(true);

                    if (characterInteraction.characterType === "pianist-happy") {
                      deferClose = true;
                      setCharacterInteraction({
                        active: true,
                        step: 1,
                        choice: null,
                        characterType: "pianist-final",
                      });
                    }

                    if (!deferClose) {
                      setCharacterInteraction({
                        active: false,
                        step: 0,
                        choice: null,
                        characterType: null,
                      });
                    }
                  } else {
                    setCharacterInteraction((prev) => ({
                      ...prev,
                      step: prev.step + 1,
                    }));
                  }
                }}
                onChoice={(choice) => {
                  if (characterInteraction.characterType === "inspector") {
                    setCharacterInteraction((prev) => ({
                      ...prev,
                      step: 4,
                      choice,
                    }));
                  } else if (characterInteraction.characterType === "chef") {
                    if (
                      inventoryItems.includes("ready-pasta") &&
                      !isChefHappy
                    ) {
                      if (choice === 1) {
                        setIsChefHappy(true);
                        setInventoryItems((prev) =>
                          prev.filter(
                            (i) =>
                              !["milk", "eggs", "chicken", "pan"].includes(i),
                          ),
                        );
                        setCharacterInteraction((prev) => ({
                          ...prev,
                          step: 3,
                          choice,
                        }));
                      } else {
                        setCharacterInteraction((prev) => ({
                          ...prev,
                          step: 3,
                          choice,
                        }));
                      }
                    } else if (choice === 1) {
                      setHasAgreedToHelpChef(true);
                      setCharacterInteraction({
                        active: false,
                        step: 0,
                        choice: null,
                        characterType: null,
                      });
                    } else {
                      setCharacterInteraction((prev) => ({
                        ...prev,
                        step: 6,
                        choice,
                      }));
                    }
                  } else if (characterInteraction.characterType === "painter") {
                    setCharacterInteraction((prev) => ({
                      ...prev,
                      step: 5,
                      choice,
                    }));
                  } else if (characterInteraction.characterType === "pianist") {
                    setCharacterInteraction((prev) => ({
                      ...prev,
                      step: 8,
                      choice,
                    }));
                  } else if (
                    characterInteraction.characterType === "pianist-door"
                  ) {
                    setCharacterInteraction((prev) => ({
                      ...prev,
                      step: 8,
                      choice,
                    }));
                  } else if (
                    characterInteraction.characterType === "caretaker"
                  ) {
                    setCharacterInteraction((prev) => ({
                      ...prev,
                      step: 8,
                      choice,
                    }));
                  }
                }}
                onClose={() =>
                  setCharacterInteraction({
                    active: false,
                    step: 0,
                    choice: null,
                    characterType: null,
                  })
                }
                hasAgreedToHelpPainter={hasAgreedToHelpPainter}
                hasAgreedToHelpPianist={hasAgreedToHelpPianist}
                hasAgreedToHelpCaretaker={hasAgreedToHelpCaretaker}
                inventoryItems={inventoryItems}
                isChefHappy={isChefHappy}
                isPainterHappy={isPainterHappy}
                isBedroomUnlocked={isBedroomUnlocked}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showGlovesReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-white/20 blur-[100px] rounded-full"></div>
                </div>
                <motion.img
                  initial={{ scale: 0.5, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  src="https://i.postimg.cc/HnvWMWfF/kppwt-nyqwy.png"
                  className="w-[40vw] max-w-[300px] h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  alt="Gloves"
                  referrerPolicy="no-referrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!inventoryItems.includes("gloves")) {
                      setInventoryItems((prev) => ["gloves", ...prev]);
                    }
                    setShowGlovesReveal(false);
                    setCharacterInteraction({
                      active: true,
                      step: 1,
                      choice: null,
                      characterType: "chef-final",
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showBrokenBroomReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-white/20 blur-[100px] rounded-full"></div>
                </div>

                <motion.img
                  initial={{ scale: 0.5, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  src="https://i.postimg.cc/DwcQ5B5j/mt_t_-sbwr.png"
                  className="w-[40vw] max-w-[300px] h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  alt="Broken Broom"
                  referrerPolicy="no-referrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!inventoryItems.includes("stick")) {
                      setInventoryItems((prev) => ["stick", ...prev]);
                    }
                    setShowBrokenBroomReveal(false);
                    setCharacterInteraction({
                      active: true,
                      step: 1,
                      choice: null,
                      characterType: "painter-final",
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showUvFlashlightReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-purple-900/40 blur-[100px] rounded-full"></div>
                </div>

                <motion.img
                  initial={{ scale: 0.5, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  src="https://i.postimg.cc/QMC3MQCc/pns-_wltrh-sgwl.png"
                  className="w-[40vw] max-w-[300px] h-auto drop-shadow-[0_0_30px_rgba(200,100,255,0.6)] z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  alt="UV Flashlight"
                  referrerPolicy="no-referrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!inventoryItems.includes("uv-flashlight")) {
                      setInventoryItems((prev) => ["uv-flashlight", ...prev]);
                    }
                    setShowUvFlashlightReveal(false);
                    setCharacterInteraction({
                      active: true,
                      step: 1,
                      choice: null,
                      characterType: "inspector-final",
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCandleReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4"
              >
                {/* Soft background glow matching yellow candle fire */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-amber-500/25 blur-[100px] rounded-full"></div>
                </div>

                <motion.img
                  initial={{ scale: 0.5, y: 0, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://i.postimg.cc/TYB5PgzB/nr-kbwy.png"
                  className="w-[20vw] max-w-[155px] h-auto drop-shadow-[0_0_40px_rgba(245,158,11,0.7)] z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  alt="Candle"
                  referrerPolicy="no-referrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInventoryItems((prev) => {
                      const filtered = prev.filter((i) => i !== "vase");
                      if (!filtered.includes("candle")) {
                        return ["candle", ...filtered];
                      }
                      return filtered;
                    });
                    setPickedUpItems((prev) =>
                      prev.includes("candle") ? prev : [...prev, "candle"],
                    );
                    setShowCandleReveal(false);
                    setIsVaseBroken(false); // Reset vase state
                    handleMessage("✓ נר", "system");
                    setIsInventoryPulsing(true);
                    setTimeout(() => setIsInventoryPulsing(false), 300);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showLitCandleReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-orange-600/30 blur-[100px] rounded-full"></div>
                </div>

                <motion.img
                  initial={{ scale: 0.5, y: 0, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://i.postimg.cc/Hs7pRbXn/nr.png"
                  className="w-[28vw] max-w-[210px] h-auto drop-shadow-[0_0_50px_rgba(255,160,0,0.8)] z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  alt="Lit Candle"
                  referrerPolicy="no-referrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInventoryItems((prev) =>
                      prev.map((i) => (i === "candle" ? "lit-candle" : i)),
                    );
                    setPickedUpItems((prev) =>
                      prev.includes("lit-candle")
                        ? prev
                        : [...prev, "lit-candle"],
                    );
                    if (selectedItem === "candle") setSelectedItem(null);
                    setShowLitCandleReveal(false);
                    handleMessage("✓ נר דולק", "system");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {currentLocation !== "outside" &&
            currentLocation !== "entrance" &&
            !characterInteraction.active &&
            !showCandleReveal &&
            !showLitCandleReveal &&
            !isVaseBroken &&
            !showRegistration &&
            !showParticipants &&
            !isPortrait && (
              <InventoryToolbar
                isOpen={inventoryOpen}
                onToggle={() => setInventoryOpen(!inventoryOpen)}
                items={inventoryItems}
                selectedItem={selectedItem}
                displayItem={displayItem}
                onSelectItem={setSelectedItem}
                onInspectItem={handleInspectItem}
                isInventoryPulsing={isInventoryPulsing}
                setShowCandleReveal={setShowCandleReveal}
              />
            )}

          <AnimatePresence>
            {activeMessage && !displayItem && (
              <TopTextMessage
                text={activeMessage}
                onComplete={() => setActiveMessage(null)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeSpeech && !displayItem && (
              <SpeechBubble
                text={activeSpeech}
                onComplete={handleSpeechComplete}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {displayItem && (
              <ItemDisplay
                item={displayItem}
                selectedItem={selectedItem}
                isVaseBroken={isVaseBroken}
                onSetVaseBroken={setIsVaseBroken}
                onInventoryToggle={setInventoryOpen}
                onCombine={(i1, i2) => {
                  setInventoryItems((prev) => {
                    const filtered = prev.filter((i) => i !== i1 && i !== i2);
                    let combinedItem = "";
                    if (
                      (i1 === "hook" && i2 === "string") ||
                      (i2 === "hook" && i1 === "string")
                    ) {
                      combinedItem = "hook-string";
                    } else if (
                      (i1 === "stick" && i2 === "stop-sign") ||
                      (i2 === "stick" && i1 === "stop-sign")
                    ) {
                      combinedItem = "stick-stop-sign";
                    }
                    setTimeout(() => {
                      setDisplayItem(combinedItem);
                      setSelectedItem(null);
                      handleMessage(
                        `✓ ${ITEM_NAMES[combinedItem] || combinedItem}`,
                        "system",
                      );
                    }, 0);
                    return [combinedItem, ...filtered];
                  });
                }}
                onTransform={(oldItem, newItem) => {
                  setInventoryItems((prev) =>
                    prev.map((i) => (i === oldItem ? newItem : i)),
                  );
                  if (selectedItem === oldItem) setSelectedItem(newItem);
                  setDisplayItem(newItem);
                  handleMessage(
                    `✓ ${ITEM_NAMES[newItem] || newItem}`,
                    "system",
                  );
                }}
                onClickCandle={() => {
                  if (hasCandleRevealed) {
                    // Should do nothing or normal inspect?
                    // The user says: "אם לוחצים על הנר בתיק הציוד שיהיה תקריב רגיל כמו שאר החפצים"
                    // It already does normal inspect if you click it in the inventory.
                    // This seems like it's inside the item display, so we just close/return.
                    setDisplayItem(null);
                    setSelectedItem(null);
                    return;
                  }
                  setDisplayItem(null);
                  setSelectedItem(null);
                  setShowCandleReveal(true);
                  setHasCandleRevealed(true);
                }}
                onClose={() => {
                  setDisplayItem(null);
                  setSelectedItem(null);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showRegistration && (
          <LeaveDetailsView onClose={() => setShowRegistration(false)} />
        )}
        {showParticipants && (
          <ParticipantsTableView onClose={() => setShowParticipants(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
