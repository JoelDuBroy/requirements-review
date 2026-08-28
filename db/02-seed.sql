insert into
    jobs (
        id,
        title,
        location,
        description
    )
values (
        '11111111-1111-4111-8111-111111111111',
        'Senior Full Stack Engineer',
        'Remote - Canada',
        'We are a 30-person product team building tools for hospital staffing. You will own features end to end, from the database up through the screens people use every day. Our stack is TypeScript, React and Next.js on the front, Python and PostgreSQL behind it, all on AWS. You will work directly with two designers and a product manager, ship most weeks, and be on a light on-call rotation. We want someone who has carried a product past its first hundred customers and knows which corners are safe to cut. The team is distributed across Canada and overlaps on Eastern Time for the middle of the day.'
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Registered Nurse - Long Term Care',
        'Toronto, ON',
        'A 180-bed long term care residence is hiring registered nurses for its day and evening rotation. You will lead a care team of personal support workers, run medication passes, manage wound care and skin integrity, and be the first clinical judgement on any change in a resident''s condition. Charting is done in an electronic record at the point of care. Families are present and involved, so clear, calm communication matters as much as clinical skill. We are a unionized site with a stable staffing ratio and a full orientation period for anyone new to long term care.'
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Warehouse Associate - Night Shift',
        'Mississauga, ON',
        'Our distribution centre runs overnight to get orders onto trucks before the morning. As an associate you will pick and pack orders against a handheld scanner, break down incoming pallets, keep aisles clear and safe, and help load outbound trailers. The floor is busy and physical, and the pace holds steady through the shift. Training is paid and takes about a week. This is a permanent position with a shift premium, a benefits package after ninety days, and a clear path onto the equipment operator team for anyone who wants it.'
    );

-- Job 1: Senior Full Stack Engineer
insert into
    requirements (
        job_id,
        text,
        kind,
        origin,
        position
    )
values (
        '11111111-1111-4111-8111-111111111111',
        '5+ years building and shipping production web applications',
        'must_have',
        'extracted',
        1
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Strong TypeScript and React experience',
        'must_have',
        'extracted',
        2
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Designs and queries relational databases, PostgreSQL preferred',
        'must_have',
        'extracted',
        3
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Must be a native English speaker',
        'must_have',
        'extracted',
        4
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Available for the middle of the day on Eastern Time',
        'must_have',
        'extracted',
        5
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Bachelor''s degree in Computer Science',
        'must_have',
        'extracted',
        6
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'No employment gaps longer than six months',
        'must_have',
        'extracted',
        7
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Experience with Next.js or a comparable framework',
        'nice_to_have',
        'extracted',
        8
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Has worked at a company of under fifty people',
        'nice_to_have',
        'extracted',
        9
    ),
    (
        '11111111-1111-4111-8111-111111111111',
        'Comfortable being on a light on-call rotation',
        'nice_to_have',
        'extracted',
        10
    );

-- Job 2: Registered Nurse - Long Term Care
insert into
    requirements (
        job_id,
        text,
        kind,
        origin,
        position
    )
values (
        '22222222-2222-4222-8222-222222222222',
        'Active RN licence with the College of Nurses of Ontario',
        'must_have',
        'extracted',
        1
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        '2+ years in long term care or geriatrics',
        'must_have',
        'extracted',
        2
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Current CPR and BLS certification',
        'must_have',
        'extracted',
        3
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Available for a rotating day and evening schedule',
        'must_have',
        'extracted',
        4
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Lives within a thirty minute drive of the residence',
        'must_have',
        'extracted',
        5
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Confident with medication administration and wound care',
        'must_have',
        'extracted',
        6
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Clear vulnerable sector police check',
        'must_have',
        'extracted',
        7
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Recent graduate, under two years since finishing school',
        'must_have',
        'extracted',
        8
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Has charted in PointClickCare or a comparable record system',
        'nice_to_have',
        'extracted',
        9
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Speaks a second language used by residents',
        'nice_to_have',
        'extracted',
        10
    ),
    (
        '22222222-2222-4222-8222-222222222222',
        'Has mentored personal support workers or nursing students',
        'nice_to_have',
        'extracted',
        11
    );

-- Job 3: Warehouse Associate - Night Shift
insert into
    requirements (
        job_id,
        text,
        kind,
        origin,
        position
    )
values (
        '33333333-3333-4333-8333-333333333333',
        'Lifts up to fifty pounds repeatedly across an eight hour shift',
        'must_have',
        'extracted',
        1
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Available Sunday through Thursday, 11pm to 7am',
        'must_have',
        'extracted',
        2
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Supplies their own steel toed safety boots',
        'must_have',
        'extracted',
        3
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Has their own reliable transportation',
        'must_have',
        'extracted',
        4
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Reads and follows written safety instructions in English',
        'must_have',
        'extracted',
        5
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'High school diploma or equivalent',
        'must_have',
        'extracted',
        6
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Forklift certification',
        'nice_to_have',
        'extracted',
        7
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Previous warehouse or distribution centre experience',
        'nice_to_have',
        'extracted',
        8
    ),
    (
        '33333333-3333-4333-8333-333333333333',
        'Has used a handheld scanner on a pick line',
        'nice_to_have',
        'extracted',
        9
    );

-- Give every seeded requirement a stable id, so a fresh database always matches
-- the copy in ./data. Rows you add later get a random one from the default.
update requirements
set
    id = md5(
        job_id::text || ':' || position::text
    )::uuid;