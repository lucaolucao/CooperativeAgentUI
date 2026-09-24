import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import "./App.css";


/* =========================================================
   Item Data
========================================================= */

const ITEMS = [
  {
    id: "oxygen_tanks",
    name: "Oxygen Tanks",
    image: "/items/outerspace/oxygen_tanks.png",
    emoji: "🫧",
  },
  {
    id: "solar_radio",
    name: "Solar Radio",
    image: "/items/outerspace/solar_radio.png",
    emoji: "📻",
  },
  {
    id: "parachute_fabric",
    name: "Parachute Fabric",
    image: "/items/outerspace/parachute_fabric.png",
    emoji: "🪂",
  },
  {
    id: "powdered_milk",
    name: "Powdered Milk",
    image: "/items/outerspace/powdered_milk.png",
    emoji: "🥛",
  },
  {
    id: "matches",
    name: "Matches",
    image: "/items/outerspace/matches.png",
    emoji: "🔥",
  },
  {
    id: "emergency_food",
    name: "Emergency Food",
    image: "/items/outerspace/emergency_food.png",
    emoji: "🍱",
  },
  {
    id: "portable_heater",
    name: "Portable Heater",
    image: "/items/outerspace/portable_heater.png",
    emoji: "♨️",
  },
  {
    id: "life_raft",
    name: "Life Raft",
    image: "/items/outerspace/life_raft.png",
    emoji: "🛟",
  },
  {
    id: "nylon_rope",
    name: "Nylon Rope (50ft.)",
    image: "/items/outerspace/nylon_rope.png",
    emoji: "🪢",
  },
  {
    id: "two_pistols",
    name: "Two Pistols",
    image: "/items/outerspace/two_pistols.png",
    emoji: "🔫",
  },
  {
    id: "star_map",
    name: "Star Map",
    image: "/items/outerspace/star_map.png",
    emoji: "🌌",
  },
  {
    id: "compass",
    name: "Compass",
    image: "/items/outerspace/compass.png",
    emoji: "🧭",
  },
  {
    id: "water",
    name: "Water (20L)",
    image: "/items/outerspace/water.png",
    emoji: "💧",
  },
  {
    id: "flares",
    name: "Flares",
    image: "/items/outerspace/flares.png",
    emoji: "🚨",
  },
  {
    id: "first_aid_kit",
    name: "First Aid Kit",
    image: "/items/outerspace/first_aid_kit.png",
    emoji: "🩹",
  },
];


/* =========================================================
   Initial Ranking
=========================================================

   Top 1  = Oxygen Tanks
   Top 5  = Solar Radio
   Top 8  = Parachute Fabric
   Top 12 = Powdered Milk
   Top 15 = Matches
*/

const INITIAL_RANKING = new Array(ITEMS.length).fill(null);

/* =========================================================
   Helper
========================================================= */

function getItem(itemId) {
  return ITEMS.find((item) => item.id === itemId);
}


/* =========================================================
   Item Image
========================================================= */

function ItemImage({ item, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`image-fallback ${className}`}>
        {item.emoji}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={item.image}
      alt={item.name}
      onError={() => setFailed(true)}
      draggable="false"
    />
  );
}


/* =========================================================
   Inventory Item
========================================================= */

function InventoryItem({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `inventory-${item.id}`,
    data: {
      type: "inventory",
      itemId: item.id,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`inventory-item ${
        isDragging ? "inventory-item-dragging" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="inventory-image">
        <ItemImage item={item} />
      </div>

      <div className="inventory-item-name">
        {item.name}
      </div>
    </div>
  );
}


/* =========================================================
   Ranking Item
========================================================= */

function RankingItem({ item, rank }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `ranking-${item.id}`,
    data: {
      type: "ranking",
      itemId: item.id,
      rank,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ranking-card ${
        isDragging ? "ranking-card-dragging" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="rank-badge">
        {String(rank).padStart(2, "0")}
      </div>

      <div className="ranking-image">
        <ItemImage item={item} />
      </div>

      <div className="ranking-name">
        {item.name}
      </div>
    </div>
  );
}


/* =========================================================
   Ranking Slot
========================================================= */

function RankingSlot({ rank, item }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${rank}`,
    data: {
      type: "slot",
      rank,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`ranking-slot ${
        isOver ? "ranking-slot-over" : ""
      }`}
    >
      {item ? (
        <RankingItem
          item={item}
          rank={rank}
        />
      ) : (
        <div className="empty-slot">

          <div className="empty-rank">
            {String(rank).padStart(2, "0")}
          </div>

          <div className="plus-icon">
            +
          </div>

          <div className="drop-label">
            Drop item here
          </div>

        </div>
      )}
    </div>
  );
}


/* =========================================================
   Available Items Drop Zone
========================================================= */

function AvailableItems({
  items,
  isDragging,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "available-items",
    data: {
      type: "inventory",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`inventory-container ${
        isOver && isDragging
          ? "inventory-container-over"
          : ""
      }`}
    >
      {items.length === 0 ? (

        <div className="all-ranked">
          <div className="complete-icon">
            ✓
          </div>

          <div>
            All items have been ranked
          </div>
        </div>

      ) : (

        <div className="inventory-grid">

          {items.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
            />
          ))}

        </div>

      )}
    </div>
  );
}


/* =========================================================
   Drag Preview
========================================================= */

function DragPreview({ item }) {
  if (!item) {
    return null;
  }

  return (
    <div className="drag-preview">

      <div className="drag-preview-image">
        <ItemImage item={item} />
      </div>

      <div className="drag-preview-name">
        {item.name}
      </div>

    </div>
  );
}


/* =========================================================
   App
========================================================= */

function App() {

  const [ranking, setRanking] = useState(
    INITIAL_RANKING
  );

  const [userId, setUserId] = useState(
    "UserA"
  );

  const [activeItemId, setActiveItemId] =
    useState(null);


  /* -------------------------------------------------------
     Sensors
  ------------------------------------------------------- */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );


  /* -------------------------------------------------------
     Available Items
  ------------------------------------------------------- */

  const availableItems = useMemo(() => {

    const rankedIds = new Set(
      ranking.filter(Boolean)
    );

    return ITEMS.filter(
      (item) => !rankedIds.has(item.id)
    );

  }, [ranking]);


  /* -------------------------------------------------------
     Progress
  ------------------------------------------------------- */

  const rankedCount =
    ranking.filter(Boolean).length;


  /* -------------------------------------------------------
     Drag Start
  ------------------------------------------------------- */

  function handleDragStart(event) {

    const itemId =
      event.active.data.current?.itemId;

    setActiveItemId(itemId);
  }


  /* -------------------------------------------------------
     Drag Cancel
  ------------------------------------------------------- */

  function handleDragCancel() {
    setActiveItemId(null);
  }


  /* -------------------------------------------------------
     Drag End
  ------------------------------------------------------- */

  function handleDragEnd(event) {

    const { active, over } = event;

    setActiveItemId(null);

    if (!over) {
      return;
    }

    const activeData =
      active.data.current;

    const overData =
      over.data.current;

    if (!activeData || !overData) {
      return;
    }


    /* =====================================================
       Inventory → Ranking
    ===================================================== */

    if (
      activeData.type === "inventory" &&
      overData.type === "slot"
    ) {

      const itemId =
        activeData.itemId;

      const targetIndex =
        overData.rank - 1;

      setRanking((previous) => {

        const next = [...previous];

        /*
          This should normally not happen because
          ranked items disappear from inventory.
        */
        const oldIndex =
          next.indexOf(itemId);

        if (oldIndex !== -1) {
          next[oldIndex] = null;
        }

        /*
          If target already contains an item,
          it goes back to Available Items.
        */
        next[targetIndex] = itemId;

        return next;
      });

      return;
    }


    /* =====================================================
       Ranking → Available Items
    ===================================================== */

    if (
      activeData.type === "ranking" &&
      overData.type === "inventory"
    ) {

      const itemId =
        activeData.itemId;

      setRanking((previous) => {

        const next = [...previous];

        const index =
          next.indexOf(itemId);

        if (index !== -1) {
          next[index] = null;
        }

        return next;
      });

      return;
    }


    /* =====================================================
       Ranking → Ranking
    ===================================================== */

    if (
      activeData.type === "ranking" &&
      overData.type === "slot"
    ) {

      const itemId =
        activeData.itemId;

      const sourceIndex =
        ranking.indexOf(itemId);

      const targetIndex =
        overData.rank - 1;

      if (
        sourceIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        return;
      }

      setRanking((previous) => {

        const next = [...previous];

        const targetItem =
          next[targetIndex];

        /*
          Swap the two items.
        */
        next[targetIndex] =
          itemId;

        next[sourceIndex] =
          targetItem || null;

        return next;
      });
    }
  }


  /* -------------------------------------------------------
     Reset
  ------------------------------------------------------- */

  function handleReset() {

    const confirmed =
      window.confirm(
        "Reset the ranking to the initial positions?"
      );

    if (!confirmed) {
      return;
    }

    setRanking(
      [...INITIAL_RANKING]
    );
  }


  /* -------------------------------------------------------
     Export JSON
  ------------------------------------------------------- */

  function handleExport() {

    const result = {

      scenario: "Outer Space",

      user: userId,

      timestamp:
        new Date().toISOString(),

      ranking:
        ranking.map(
          (itemId, index) => {

            const item =
              itemId
                ? getItem(itemId)
                : null;

            return {
              rank: index + 1,
              itemId: itemId,
              itemName:
                item?.name ?? null,
            };
          }
        ),
    };


    const blob = new Blob(
      [
        JSON.stringify(
          result,
          null,
          2
        ),
      ],
      {
        type:
          "application/json",
      }
    );


    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${userId}_outer_space_ranking.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }


  /* -------------------------------------------------------
     Active Item
  ------------------------------------------------------- */

  const activeItem =
    activeItemId
      ? getItem(activeItemId)
      : null;


  /* =======================================================
     Render
  ======================================================= */

  return (

    <DndContext

      sensors={sensors}

      onDragStart={
        handleDragStart
      }

      onDragCancel={
        handleDragCancel
      }

      onDragEnd={
        handleDragEnd
      }

    >

      <div className="app">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="header">

          <div className="header-left">

            <div className="scenario-label">
              OUTER SPACE
            </div>

            <h1>
              Item Ranking
            </h1>

            <p>
              Rank the items according to their importance.
            </p>

          </div>


          <div className="header-right">

            <div className="user-section">

              <div className="user-caption">
                PARTICIPANT
              </div>

              <input
                className="user-input"
                value={userId}
                onChange={(event) =>
                  setUserId(
                    event.target.value
                  )
                }
                placeholder="User ID"
              />

            </div>


            <div className="progress-card">

              <div className="progress-number">
                {rankedCount}
                <span>
                  / 15
                </span>
              </div>

              <div className="progress-label">
                ranked
              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            RANKING
        ================================================= */}

        <section className="ranking-section">

          <div className="section-header">

            <div>

              <h2>
                Your Ranking
              </h2>

              <p>
                Drag items to arrange their priority.
              </p>

            </div>


            <div className="ranking-status">

              {rankedCount === 15
                ? "Complete"
                : `${15 - rankedCount} items remaining`
              }

            </div>

          </div>


          <div className="ranking-grid">

            {ranking.map(
              (itemId, index) => {

                const item =
                  itemId
                    ? getItem(itemId)
                    : null;

                return (

                  <RankingSlot

                    key={index}

                    rank={index + 1}

                    item={item}

                  />

                );
              }
            )}

          </div>

        </section>


        {/* =================================================
            AVAILABLE ITEMS
        ================================================= */}

        <section className="available-section">

          <div className="section-header">

            <div>

              <h2>
                Available Items
              </h2>

              <p>
                Drag an item into the ranking board.
              </p>

            </div>


            <div className="available-status">

              {availableItems.length}
              {" "}
              remaining

            </div>

          </div>


          <AvailableItems
            items={availableItems}
            isDragging={
              activeItemId !== null
            }
          />

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="footer">

          <div className="footer-hint">

            Drag an item back here to remove it
            from the ranking.

          </div>


          <div className="actions">

            <button
              className="button button-secondary"
              onClick={handleReset}
            >
              ↺ Reset
            </button>


            <button
              className="button button-primary"
              onClick={handleExport}
            >
              ↓ Export Results
            </button>

          </div>

        </footer>

      </div>


      {/* ===================================================
          DRAG OVERLAY
      =================================================== */}

      <DragOverlay>

        <DragPreview
          item={activeItem}
        />

      </DragOverlay>

    </DndContext>
  );
}

export default App;