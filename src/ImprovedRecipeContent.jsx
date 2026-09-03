import { useEffect, useState } from 'react';
import toBeReplacedImage from './assets/to-be-replaced.png';
import './RecipeContent.css';

const RECIPE_IMAGE_API_URL = 'https://localhost:8027/api/recipe-image'

export function ImprovedRecipeContent({ recipe_conversation_id, message }) {
    const [images, setImages] = useState(() =>
        Array.from({ length: message.content.steps?.length || 0 }, (_, i) => ({
            timestamp: message.content.steps?.[i]?.timestamp || 0.0,
            description: message.content.steps?.[i]?.description || '',
            image_path: message.content.steps?.[i]?.image_path || '',
            image_status: message.content.steps?.[i]?.image_status || 'extracting'
        }))
    );

    return (
        <div>
            <p>{message.content.description}</p>
            {images?.length > 0 && (
                <ol className="recipe-steps">
                    {images.map((image, index) => (
                        <li key={index}>
                            {image.description}
                            <p>
                                {(image.image_status === 'extracted') ? (
                                    <img
                                        src={`${RECIPE_IMAGE_API_URL}/${image.image_path}`}
                                        alt={`Step ${index + 1} Image`}
                                    />) : ((image.image_status === 'extracting') ? (
                                    <img src={generatedImage} alt="Generating..." class="thin-border" width="640" height="360"/>
                                    ) : (
                                    <img src={toBeReplacedImage} alt="To Be Replaced" class="thin-border" width="640" height="360"/>
                                    ))
                                }
                            </p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

