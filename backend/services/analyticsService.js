/**
 * Analyze sentiment of a review
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Sentiment analysis results
 */
const analyzeSentiment = async (review_text) => {
    try {
        const response = await fetch("http://csad-analytics:8000/sentiment/sentimentscore", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ review_text }),
        });
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, error };
    }
};

module.exports = { analyzeSentiment };