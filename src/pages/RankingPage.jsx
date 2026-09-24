// import { Navigate, useParams } from "react-router-dom";

// import scenarios from "../scenarios";
// import RankingList from "../components/RankingList";

// export default function RankingPage() {

//     // 从 URL 获取 scenario
//     const { scenario } = useParams();

//     // 读取对应配置
//     const config = scenarios[scenario];

//     // 如果不存在，回到默认 Moon
//     if (!config) {
//         return <Navigate to="/scenario/moon" replace />;
//     }

//     return (
//         <div className="ranking-page">

//             <h1>{config.title}</h1>

//             <p>{config.description}</p>

//             <RankingList
//                 scenario={scenario}
//                 items={config.items}
//             />

//         </div>
//     );

// }

import { Navigate, useParams } from "react-router-dom";

import scenarios from "../scenarios";
import PartialItemsRanking from "../components/PartialItemsRanking";

export default function RankingPage() {
    const { scenario } = useParams();

    const config = scenarios[scenario];

    if (!config) {
        return <Navigate to="/scenario/moon" replace />;
    }

    return (
        <PartialItemsRanking
            scenario={scenario}
            title={config.title}
            description={config.description}
            items={config.items}
        />
    );
}