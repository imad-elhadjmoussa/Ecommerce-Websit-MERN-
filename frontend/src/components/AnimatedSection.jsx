// AnimatedSection.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({
    children,
    initial = { opacity: 0 },
    animate = { opacity: 1 },
    transition = { duration: 0.8, ease: 'easeOut' },
    threshold = 0.3,
    triggerOnce = true,
    className = '',
    style = {},
}) => {
    const { ref, inView } = useInView({
        triggerOnce,
        threshold,
    });

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={inView ? animate : initial}
            transition={transition}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
