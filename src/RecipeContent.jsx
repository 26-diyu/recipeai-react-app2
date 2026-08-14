import { useEffect, useState } from 'react';
import generatedImage from './assets/generating.png';

const RECIPE_IMAGE_API_URL = 'https://localhost:8027/api/recipe-image'

export function RecipeContent({ recipe_conversation_id, message }) {
    const [images, setImages] = useState(() =>
        Array.from({ length: message.content.steps?.length || 0 }, (_, i) => ({
            timestamp: message.content.steps?.[i]?.timestamp || 0.0,
            description: message.content.steps?.[i]?.description || '',
            image_path: message.content.steps?.[i]?.image_path || '',
            image_status: message.content.steps?.[i]?.image_status || 'extracting'
        }))
    );

    useEffect(() => {
        const sse = new EventSource(
            `https://localhost:8027/api/generate-batch/stream-concurrent?recipe_conversation_id=${recipe_conversation_id}&message_id=${message.mid}`,
            {
                withCredentials: true
            }
        );

        sse.addEventListener('image_update', (event) => {
            const data = JSON.parse(event.data);
            setImages((prev) =>
                prev.map((slot, index) =>
                    slot.image_path === data.image_path ? { ...slot, ...data } : slot
                )
            );
        });

        sse.addEventListener('batch_complete', () => sse.close());

        return () => sse.close();
    }, [recipe_conversation_id, message.mid]);

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
                                    />) : (
                                    <img src={generatedImage} alt="Generating..."/>
                                )}
                            </p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

