'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import RewardCard from './RewardCard';
import FilterToolbar from './FilterToolbar';
import SuccessToast from './SuccessToast';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load modals - only loaded when needed
const RedemptionModal = dynamic(() => import('./RedemptionModal'), { ssr: false });
const TransactionHistoryModal = dynamic(() => import('./TransactionHistoryModal'), { ssr: false });

interface Reward {
    id: string;
    title: string;
    description: string;
    tokenCost: number;
    category: string;
    availability: 'available' | 'limited' | 'soldOut';
    image: string;
    alt: string;
    requirements?: string;
    stock?: number;
    isBlockchainService?: boolean;
    serviceId?: string;
}

const RedeemTokensContent = () => {
    const { userProfile } = useAuth();
    // Mock web3 hooks removed

    const [isHydrated, setIsHydrated] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCostRange, setSelectedCostRange] = useState('all');
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        // Set mock balance
        setCurrentBalance(userProfile?.tokens || 1250);
    }, [userProfile]);

    const mockRewards: Reward[] = [
        {
            id: '1',
            title: 'Advanced JavaScript Course',
            description: 'Master modern JavaScript with ES6+, async programming, and advanced patterns for building scalable applications.',
            tokenCost: 1500,
            category: 'courses',
            availability: 'available',
            image: "https://images.unsplash.com/photo-1516101922849-2bf0be616449",
            alt: 'Modern laptop displaying colorful JavaScript code on dark screen with coffee cup beside',
            requirements: 'Complete Basic JavaScript course first'
        },
        {
            id: '2',
            title: 'Professional Certificate',
            description: 'Earn a verified certificate to showcase your achievements and boost your professional profile.',
            tokenCost: 800,
            category: 'certificates',
            availability: 'available',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_11ca8e2c2-1767753538489.png",
            alt: 'Professional certificate with gold seal and ribbon on wooden desk with pen'
        },
        {
            id: '3',
            title: 'Learn2Earn Premium T-Shirt',
            description: 'High-quality cotton t-shirt with exclusive Learn2Earn branding and comfortable fit.',
            tokenCost: 300,
            category: 'merchandise',
            availability: 'limited',
            image: "https://images.unsplash.com/photo-1666358068038-e3bf7d212fe7",
            alt: 'Black premium cotton t-shirt with white Learn2Earn logo on wooden background',
            stock: 15
        },
        {
            id: '4',
            title: 'Udemy Course Credits',
            description: 'Redeem tokens for Udemy course credits and access thousands of courses on any topic.',
            tokenCost: 1000,
            category: 'credits',
            availability: 'available',
            image: "https://images.unsplash.com/photo-1575089976117-66ae42220e24",
            alt: 'Person using tablet displaying online learning platform with course thumbnails'
        },
        {
            id: '5',
            title: 'React Mastery Course',
            description: 'Deep dive into React ecosystem including hooks, context, Redux, and Next.js for building modern web apps.',
            tokenCost: 1800,
            category: 'courses',
            availability: 'available',
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd7e25d2-1764751416114.png",
            alt: 'Computer screen showing React component code with blue React logo visible',
            requirements: 'JavaScript fundamentals required'
        },
        {
            id: '6',
            title: 'Blockchain Fundamentals Certificate',
            description: 'Demonstrate your understanding of blockchain technology, cryptocurrencies, and decentralized systems.',
            tokenCost: 1200,
            category: 'certificates',
            availability: 'available',
            image: "https://images.unsplash.com/photo-1631897641495-c055d9288cdf",
            alt: 'Golden Bitcoin cryptocurrency coin on circuit board with blockchain network visualization'
        },
        {
            id: '7',
            title: 'Premium Hoodie',
            description: 'Comfortable premium hoodie with Learn2Earn logo, perfect for coding sessions and casual wear.',
            tokenCost: 600,
            category: 'merchandise',
            availability: 'limited',
            image: "https://images.unsplash.com/photo-1666358071519-3569e3fe72c5",
            alt: 'Navy blue premium hoodie with embroidered logo hanging on wooden hanger',
            stock: 8
        },
        {
            id: '8',
            title: 'Coursera Subscription',
            description: 'One month premium Coursera subscription with access to specializations and professional certificates.',
            tokenCost: 2000,
            category: 'credits',
            availability: 'available',
            image: "https://images.unsplash.com/photo-1604872436472-93d852afe82e",
            alt: 'Person studying on laptop with online course interface and notebook on desk'
        },
        {
            id: '9',
            title: 'Python for Data Science',
            description: 'Learn Python programming for data analysis, visualization, and machine learning applications.',
            tokenCost: 1600,
            category: 'courses',
            availability: 'available',
            image: "https://images.unsplash.com/photo-1730155298936-d7276dbf9140",
            alt: 'Computer screen displaying Python code for data analysis with colorful charts'
        },
        {
            id: '10',
            title: 'Wireless Earbuds',
            description: 'High-quality wireless earbuds perfect for listening to course lectures and podcasts.',
            tokenCost: 450,
            category: 'merchandise',
            availability: 'soldOut',
            image: "https://images.unsplash.com/photo-1584657342356-7d5c8526cc8e",
            alt: 'White wireless earbuds in charging case on minimalist desk setup'
        }
    ];

    const allRewards = mockRewards;

    const filterRewards = () => {
        return allRewards.filter((reward) => {
            const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;

            let costMatch = true;
            if (selectedCostRange !== 'all') {
                if (selectedCostRange === '0-500') {
                    costMatch = reward.tokenCost <= 500;
                } else if (selectedCostRange === '501-1000') {
                    costMatch = reward.tokenCost > 500 && reward.tokenCost <= 1000;
                } else if (selectedCostRange === '1001-2000') {
                    costMatch = reward.tokenCost > 1000 && reward.tokenCost <= 2000;
                } else if (selectedCostRange === '2001+') {
                    costMatch = reward.tokenCost > 2000;
                }
            }

            const availabilityMatch =
                selectedAvailability === 'all' || reward.availability === selectedAvailability;

            return categoryMatch && costMatch && availabilityMatch;
        });
    };

    const filteredRewards = filterRewards();

    const handleRedeem = (rewardId: string) => {
        const reward = mockRewards.find((r) => r.id === rewardId);
        if (reward) {
            setSelectedReward(reward);
            setIsModalOpen(true);
        }
    };

    const handleWishlist = (rewardId: string) => {
        setWishlist((prev) =>
            prev.includes(rewardId) ?
                prev.filter((id) => id !== rewardId) :
                [...prev, rewardId]
        );
    };

    const handleConfirmRedemption = async () => {
        if (selectedReward) {
            try {
                // Mock redemption
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Note: userProfile token deduction should happen via backend or AuthContext update
                // For now, we just simulate success.

                setSuccessMessage(`Successfully redeemed ${selectedReward.title}!`);
                setShowSuccessToast(true);
                setIsModalOpen(false);
                setSelectedReward(null);
            } catch (e) {
                console.error("Redemption failed", e);
                alert("Redemption failed. See console.");
            }
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory('all');
        setSelectedCostRange('all');
        setSelectedAvailability('all');
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="flex min-h-[50vh] items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="font-caption text-sm text-muted-foreground">Loading rewards...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                            Redeem Your Tokens
                        </h1>
                        <p className="mt-2 font-caption text-base text-muted-foreground">
                            Exchange your earned tokens for valuable rewards and benefits
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Current Balance */}
                        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                            <Icon name="CurrencyDollarIcon" size={20} className="text-primary" />
                            <span className="font-heading text-lg font-bold text-primary">{currentBalance}</span>
                            <span className="font-caption text-sm text-muted-foreground">tokens</span>
                        </div>

                        <button
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="flex items-center gap-2 rounded-md bg-muted px-6 py-3 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        >
                            <Icon name="ClockIcon" size={18} />
                            <span>Transaction History</span>
                        </button>
                    </div>
                </div>

                <FilterToolbar
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedCostRange={selectedCostRange}
                    onCostRangeChange={setSelectedCostRange}
                    selectedAvailability={selectedAvailability}
                    onAvailabilityChange={setSelectedAvailability}
                    onClearFilters={handleClearFilters}
                />

                <div className="flex items-center justify-between rounded-xl bg-card/50 p-4 backdrop-blur-sm shadow-glow-sm">
                    <span className="font-caption text-sm text-card-foreground">
                        Showing {filteredRewards.length} of {mockRewards.length} rewards
                    </span>
                    {wishlist.length > 0 && (
                        <button
                            onClick={() => { }}
                            className="flex items-center gap-2 rounded-md bg-error/20 px-4 py-2 font-caption text-sm font-medium text-error transition-smooth hover:bg-error/30 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background"
                        >
                            <Icon name="HeartIcon" size={16} variant="solid" />
                            <span>{wishlist.length} Wishlist</span>
                        </button>
                    )}
                </div>

                {filteredRewards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl bg-card/50 py-16 backdrop-blur-sm">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Icon name="FunnelIcon" size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                            No rewards found
                        </h3>
                        <p className="mb-6 font-caption text-sm text-muted-foreground">
                            Try adjusting your filters to see more options
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="rounded-md bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredRewards.map((reward) => (
                            <RewardCard
                                key={reward.id}
                                reward={reward}
                                onRedeem={handleRedeem}
                                onWishlist={handleWishlist}
                                isInWishlist={wishlist.includes(reward.id)}
                            />
                        ))}
                    </div>
                )}

                <RedemptionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedReward(null);
                    }}
                    reward={selectedReward}
                    currentBalance={currentBalance}
                    onConfirm={handleConfirmRedemption}
                />

                <SuccessToast
                    isVisible={showSuccessToast}
                    message={successMessage}
                    onClose={() => setShowSuccessToast(false)}
                />

                <TransactionHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default RedeemTokensContent;
