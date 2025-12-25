import { Eye, EyeClosed, Globe, Lock } from 'lucide-react'
import React from 'react'
interface Props {
selectedVisibility:string,
showVisibilityMenu:boolean,
setShowVisibilityMenu:React.Dispatch<React.SetStateAction<boolean>>,
selectVisibility: (visibility:string) => void;

}

const VisibilitySelector:React.FC<Props> = ({showVisibilityMenu, selectedVisibility, setShowVisibilityMenu, selectVisibility}) => {
    return (
        <div className="mb-2 relative">
            <button
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800"
            >
                <div className="flex items-center gap-3">
                    <Eye size={24} className="text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Choose visibility</p>
                        <p className="font-semibold">{selectedVisibility}</p>
                    </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Privacy Dropdown Menu */}
            {showVisibilityMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4 z-10">
                    {/* Visible Option */}
                    <div
                        onClick={() => selectVisibility('Visible')}
                        className="flex items-start gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer mb-3"
                    >
                        <Eye size={24} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">Visible</p>
                            <p className="text-sm text-gray-400">
                                Anyone can find this group.
                            </p>
                           
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${selectedVisibility === 'Visible'
                            ? 'border-blue-500 bg-blue-500 flex items-center justify-center'
                            : 'border-gray-500'
                            }`}>
                            {selectedVisibility === 'Visible' && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>

                    {/* Hidden Option */}
                    <div
                        onClick={() => selectVisibility('Hidden')}
                        className="flex items-start gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                        <EyeClosed size={24} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">Hidden</p>
                            <p className="text-sm text-gray-400">
                                Can only be found using invite link.
                            </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${selectedVisibility === 'Hidden'
                            ? 'border-blue-500 bg-blue-500 flex items-center justify-center'
                            : 'border-gray-500'
                            }`}>
                            {selectedVisibility === 'Hidden' && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VisibilitySelector