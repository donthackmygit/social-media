import React from "react";

const Loading = ({hieght = '100vh'}) => {
    return (
        <div style={{hieght}} className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 rounded0full border-3 border-purple-500 border-t-transparent animate-spin"></div>
        </div>
    )
}

export default Loading