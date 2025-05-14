import PropTypes from "prop-types";

const LoadingScreen = ({ progress, mode }) => {
    const showProgressBar =
        mode === "progress" && progress > 0 && progress < 100;

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 flex flex-col justify-center items-center z-50">
            {showProgressBar ? (
                <>
                    <div className="relative w-4/5 max-w-md h-2 bg-gray-300 rounded-full mb-4">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-white text-lg">{progress}% loaded</p>
                </>
            ) : (
                <>
                    <div className="animate-spin w-10 h-10 border-4 border-white border-opacity-50 border-t-blue-500 rounded-full mb-4"></div>
                    <h2 className="text-white text-2xl font-semibold">
                        Loading...
                    </h2>
                </>
            )}
        </div>
    );
};

LoadingScreen.propTypes = {
    progress: PropTypes.number.isRequired,
    mode: PropTypes.oneOf(["spinner", "progress"]).isRequired,
};

export default LoadingScreen;
