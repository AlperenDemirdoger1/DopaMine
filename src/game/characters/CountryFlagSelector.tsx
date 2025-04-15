import React, { useState } from 'react';
import { US, GB, DE, FR, ES, IT, JP, CN, BR, RU, IN, CA, AU, TR } from 'country-flag-icons/react/3x2';

export type CountryCode = 'US' | 'GB' | 'DE' | 'FR' | 'ES' | 'IT' | 'JP' | 'CN' | 'BR' | 'RU' | 'IN' | 'CA' | 'AU' | 'TR';

interface CountryFlagSelectorProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
}

const countryNames: Record<CountryCode, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  JP: 'Japan',
  CN: 'China',
  BR: 'Brazil',
  RU: 'Russia',
  IN: 'India',
  CA: 'Canada',
  AU: 'Australia',
  TR: 'Turkey'
};

const CountryFlagSelector: React.FC<CountryFlagSelectorProps> = ({ selectedCountry, onSelectCountry }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCountrySelect = (country: CountryCode) => {
    onSelectCountry(country);
    setIsOpen(false);
  };

  const getFlagComponent = (country: CountryCode) => {
    switch (country) {
      case 'US': return <US />;
      case 'GB': return <GB />;
      case 'DE': return <DE />;
      case 'FR': return <FR />;
      case 'ES': return <ES />;
      case 'IT': return <IT />;
      case 'JP': return <JP />;
      case 'CN': return <CN />;
      case 'BR': return <BR />;
      case 'RU': return <RU />;
      case 'IN': return <IN />;
      case 'CA': return <CA />;
      case 'AU': return <AU />;
      case 'TR': return <TR />;
    }
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-center mb-2 text-purple-400">Select Your Flag</h3>
      </div>
      
      <div 
        className="w-32 h-20 border-2 border-gray-500 rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:border-purple-500"
        onClick={toggleDropdown}
      >
        <div className="w-full h-full">
          {getFlagComponent(selectedCountry)}
        </div>
      </div>
      
      <div className="mt-2 text-center text-sm">
        {countryNames[selectedCountry]}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 max-h-80 overflow-y-auto bg-gray-800 rounded-md shadow-lg border border-gray-700">
          <div className="grid grid-cols-3 gap-2 p-2">
            {Object.keys(countryNames).map((country) => (
              <div
                key={country}
                className={`w-full aspect-video border-2 ${
                  selectedCountry === country ? 'border-purple-500' : 'border-gray-600'
                } rounded-sm overflow-hidden cursor-pointer hover:border-purple-400 transition-all duration-200`}
                onClick={() => handleCountrySelect(country as CountryCode)}
              >
                <div className="w-full h-full">
                  {getFlagComponent(country as CountryCode)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryFlagSelector;
