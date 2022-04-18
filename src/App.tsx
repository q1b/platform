import type { Component} from "solid-js";
import { lazy } from "solid-js";

import { Route, Routes } from "solid-app-router";

const WorkspacePage = lazy(() => import("./views/Studio"))
const ControlPanel = lazy(() => import("./views/ControlPanel"));
const CheckIn = lazy(() => import("./views/Auth/CheckIn"));
const VerificationPage = lazy(() => import("./views/Auth/Verification"));
const RegistrationPage = lazy(() => import("./views/Auth/Registration"));
// const TimeLineWrapper = lazy(() => import("./views/timeline"));
// const AudioEditor = lazy(() => import("./views/audio"));
// const Shopify = lazy(() => import("./views/shopify"));

const App: Component = () => {
    return (
        <div class='app'>
            <Routes>
                <Route path="/check-in" component={CheckIn}/>
                <Route path="/verify" component={VerificationPage}/>
                <Route path="/register" component={RegistrationPage}/>
				<Route path="/" component={ControlPanel} />
                <Route path="/workspace/:workspaceId" component={WorkspacePage}>
                    
                </Route>
                {/* <Route path="/" component={Layout}>
                    <Route path="/video/:folderId/:fileId" component={TimeLineWrapper} />
                    <Route path="/video/:folderId/:fileId/audio/:audioId" component={AudioEditor} />
                    <Route path="/video/:folderId/:fileId/audio/*all" component={AudioEditor} />
                    <Route path="/shopify" component={Shopify} />
                    <Route path="/*all" component={TimeLineWrapper} />
                </Route> */}
            </Routes>
            {/* <Routes>
                <Route path="/">
                </Route>
            </Routes> */}
        </div>
    );
};

export default App;
