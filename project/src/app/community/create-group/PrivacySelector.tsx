import { Globe, Lock } from 'lucide-react'
import React, { SetStateAction } from 'react'
interface Props {
selectedPrivacy:string,
showPrivacyMenu:boolean,
setShowPrivacyMenu:React.Dispatch<React.SetStateAction<boolean>>,
selectPrivacy: (privacy:string) => void;

}

const PrivacySelector:React.FC<Props> = ({showPrivacyMenu, selectedPrivacy, setShowPrivacyMenu, selectPrivacy}) => {
    return (
        <div className="mb-2 relative">
            <button
                onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800"
            >
                <div className="flex items-center gap-3">
                    <Globe size={24} className="text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Choose privacy</p>
                        <p className="font-semibold">{selectedPrivacy}</p>
                    </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Privacy Dropdown Menu */}
            {showPrivacyMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4 z-10">
                    {/* Public Option */}
                    <div
                        onClick={() => selectPrivacy('Public')}
                        className="flex items-start gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer mb-3"
                    >
                        <Globe size={24} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">Public</p>
                            <p className="text-sm text-gray-400">
                                Anyone can see who's in the group and what they post.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Depending on your group's size and age, you might be able to change to private later.
                            </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${selectedPrivacy === 'Public'
                            ? 'border-blue-500 bg-blue-500 flex items-center justify-center'
                            : 'border-gray-500'
                            }`}>
                            {selectedPrivacy === 'Public' && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>

                    {/* Private Option */}
                    <div
                        onClick={() => selectPrivacy('Private')}
                        className="flex items-start gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                        <Lock size={24} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">Private</p>
                            <p className="text-sm text-gray-400">
                                Only members can see who's in the group and what they post.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                You might be able to change to public later.
                            </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${selectedPrivacy === 'Private'
                            ? 'border-blue-500 bg-blue-500 flex items-center justify-center'
                            : 'border-gray-500'
                            }`}>
                            {selectedPrivacy === 'Private' && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PrivacySelector