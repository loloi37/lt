## Improvements To Do

1. First, finish the real archive view page so `/archive/[memorialId]/view` renders actual biography, photos, memories, and videos instead of placeholder blocks. Right now the rest of the UX points users toward this page, so it has to become trustworthy before polishing the surrounding flows.

2. After that, make the role system fully consistent in the UI, especially for the new `reader` role. A reader should only be able to view content, so remove contribution actions, witness wording, and any misleading permissions from welcome pages, archive hubs, and related components.

3. Then align the behavior and the copy for `co_guardian`. If co-guardians really publish directly, implement that in the contribution flow; if not, change the messaging everywhere so the UI does not promise something the product does not do.

4. Harden route protection and session security in middleware for protected areas like `/archive`, `/dashboard`, and `/create`. The server should block unauthenticated or invalid access as early as possible, not rely only on client-side checks or late API failures.

5. Replace scattered invitation logic with one canonical invitation flow and one shared invite UI. This should include one main invite API route, one reusable invite component, and one clear place where owners manage invites and members.

6. Improve realtime role-session handling so permission changes are reflected immediately in the browser. If a user is downgraded or revoked mid-session, the UI should refresh safely, show a clear message, and redirect them away from pages they can no longer access.

7. Add a proper revoked-access experience such as `/archive/[memorialId]/revoked` or an equivalent graceful fallback page. Users should never just hit a confusing error state after losing access.

8. Add full member-management actions, not only role changes. Owners should be able to remove members, re-invite pending members, and manage membership states cleanly from one place.

9. Add a family access-request flow for related memorials. If a witness needs access to another family archive, the system should support requesting access, owner approval, and clear status tracking.

10. Improve the contribution review model beyond only `approved` and `rejected`. Add support for revision loops such as `needs_changes`, track revision counts, and avoid dead-end moderation when a contribution could be improved instead.

11. Tighten invitation and contribution integrity in the database and UX. Keep duplicate pending invites under control, make invitation refresh/re-send behavior explicit, and ensure anonymous contribution verification rules match the actual frontend and schema.

12. Remove witness invitation responsibility from the memorial creation wizard and move it into dedicated management surfaces. Creation should stay focused on building the archive, while member and role management should happen in clearer, later-stage interfaces.

13. Centralize permission logic into capability-based data such as `canView`, `canContribute`, `canReview`, and `canInvite`, instead of repeating raw role checks across many pages. This will reduce bugs, make `reader` easier to support, and keep future UX changes much safer.
